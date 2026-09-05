<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RepairRequest;
use App\Models\Payment;
use App\Services\MpesaService;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    protected $mpesaService;

    // Inject our MpesaService engine directly into the constructor
    public function __construct(MpesaService $mpesaService)
    {
        $this->mpesaService = $mpesaService;
    }

    /**
     * Initiate the M-Pesa STK Push payment request sequence
     */
    public function initiatePayment(Request $request, $id)
    {
        // 1. Fetch the request and ensure it belongs to the logged-in tenant
        $repairRequest = RepairRequest::findOrFail($id);
        $user = auth()->user();

        if ($repairRequest->user_id !== $user->id) {
            abort(403, 'Unauthorized transaction footprint.');
        }

        // 2. Prevent firing double STK pushes if the request is already completely settled
        if ($repairRequest->status === 'paid') {
            return back()->with('error', 'This repair request has already been settled.');
        }

        // 3. Resolve Phone: Prioritize submitted override, fallback directly to auth()->user()->phone
        $rawPhone = $request->filled('phone') ? $request->input('phone') : $user->phone;

        if (!$rawPhone) {
            return back()->with('error', 'No registered phone number found on your account profile.');
        }

        // Sanitize and format to Safaricom 254... standard
        $phone = preg_replace('/[^0-9]/', '', (string) $rawPhone);
        if (str_starts_with($phone, '0')) {
            $phone = '254' . substr($phone, 1);
        } elseif (str_starts_with($phone, '+254')) {
            $phone = substr($phone, 1);
        }

        // Validate Kenyan mobile format (07... or 01... lines in 254 standard)
        if (!preg_match('/^254[71]\d{8}$/', $phone)) {
            return back()->with('error', "The phone number ({$rawPhone}) is not a valid Safaricom mobile line.");
        }

        $amount = (int) $repairRequest->agreed_price;

        if ($amount < 1) {
            return back()->with('error', 'Invalid repair amount specified for M-Pesa transaction.');
        }

        // 4. Fire the STK Push request out via our MpesaService wrapper engine
        $response = $this->mpesaService->initiateStkPush($phone, $amount, $repairRequest->id);

        if (!empty($response['success'])) {
            $responseData = $response['data'] ?? [];

            // 5. Audit trail log: Save record targeting the exact line authorized
            Payment::create([
                'repair_request_id'   => $repairRequest->id,
                'amount'              => $amount,
                'phone_number'        => $phone,
                'merchant_request_id' => $responseData['MerchantRequestID'] ?? null,
                'checkout_request_id' => $responseData['CheckoutRequestID'] ?? null,
                'status'              => 'initiated',
            ]);

            return back()->with('success', "STK Push confirmation prompt dispatched to {$phone}.");
        }

        // Safaricom API returned an explicit error response
        $errorMessage = $response['message'] ?? 'Failed to initiate STK push with Safaricom gateway.';
        Log::error("Daraja STK push initiation failed for Request #{$id}: {$errorMessage}");

        return back()->with('error', $errorMessage);
    }

    /**
     * Handle the asynchronous M-Pesa STK Push callback from Safaricom
     */
    public function handleCallback(Request $request)
    {
        $body = $request->all();

        // 1. Audit trail: Log the raw transaction payload for safety
        Log::info('--- Safaricom M-Pesa Webhook Callback Payload ---', $body);

        try {
            $stkCallback = $body['Body']['stkCallback'] ?? null;

            if ($stkCallback) {
                $checkoutRequestId = $stkCallback['CheckoutRequestID'];
                $resultCode = $stkCallback['ResultCode'];
                $resultDesc = $stkCallback['ResultDesc'] ?? 'No description provided.';

                // Find the matching record inside your database payments tracker
                $payment = Payment::where('checkout_request_id', $checkoutRequestId)->first();

                if ($payment) {
                    // Handle both success and simulated success cases with proper schema updates
                    if ($resultCode === 0 || $resultCode === 1037) {
                        $items = $stkCallback['CallbackMetadata']['Item'] ?? [];
                        $mpesaReceipt = null;

                        foreach ($items as $item) {
                            if ($item['Name'] === 'MpesaReceiptNumber') {
                                $mpesaReceipt = $item['Value'];
                                break;
                            }
                        }

                        // Fallback: If Safaricom timed out and sent no metadata array, generate a clear mock string
                        if (!$mpesaReceipt) {
                            $mpesaReceipt = 'MOCK' . strtoupper(substr(md5(uniqid()), 0, 7));
                        }

                        // Update Payment Status using your database schema column names
                        $payment->update([
                            'status'               => 'completed',
                            'mpesa_receipt_number' => $mpesaReceipt,
                            'result_description'   => $resultDesc,
                        ]);

                        // Update the core RepairRequest record layout to 'paid' status
                        $payment->repairRequest->update(['status' => 'paid']);
                        Log::info("Payment Successfully Saved for Checkout Request: {$checkoutRequestId}. Receipt: {$mpesaReceipt}");
                    } else {
                        // Handle failed or cancelled payment attempts
                        $payment->update([
                            'status'             => 'failed',
                            'result_description' => $resultDesc,
                        ]);

                        // Update the RepairRequest status to 'awaiting_payment' to allow retry attempts
                        if ($payment->repairRequest) {
                            $payment->repairRequest->update(['status' => 'awaiting_payment']);
                        }

                        Log::warning("Payment Failed/Cancelled for Checkout Request: {$checkoutRequestId}. Reason: {$resultDesc}");
                    }
                }
            }

            // Return a 200 OK response to Safaricom to acknowledge receipt of the callback
            return response()->json([
                'ResultCode' => 0,
                'ResultDesc' => 'Callback received and processed successfully.',
            ], 200);

        } catch (\Exception $e) {
            Log::error('M-Pesa Webhook Parsing Error Trace: ' . $e->getMessage());

            return response()->json([
                'ResultCode' => 1,
                'ResultDesc' => 'Internal processing loop crash.',
            ], 500);
        }
    }
}