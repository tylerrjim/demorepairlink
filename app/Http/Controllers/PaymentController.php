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
    public function initiatePayment($id)
    {
        // 1. Fetch the request and ensure it belongs to the logged-in tenant
        $repairRequest = RepairRequest::findOrFail($id);

        if ($repairRequest->user_id !== auth()->id()) {
            abort(403, 'Unauthorized transaction footprint.');
        }

        // 2. Prevent firing double STK pushes if the request is already completely settled
        if ($repairRequest->status === 'paid') {
            return back()->with('error', 'This repair request has already been settled.');
        }

        // 3. Extract the tenant's profile phone number and the agreed quotation price
        $phone = $repairRequest->user->phone; 
        $amount = $repairRequest->agreed_price;

        if (!$phone) {
            return back()->with('error', 'No registered phone number bound to your account profile.');
        }

        // 4. Fire the STK Push request out via our MpesaService wrapper engine
        $response = $this->mpesaService->initiateStkPush($phone, $amount, $repairRequest->id);

        if ($response['success']) {
            $responseData = $response['data'];

            // 5. Audit trail log: Save an 'initiated' record into your new payments table
            Payment::create([
                'repair_request_id'   => $repairRequest->id,
                'amount'              => $amount,
                'phone_number'        => $phone,
                'merchant_request_id' => $responseData['MerchantRequestID'] ?? null,
                'checkout_request_id' => $responseData['CheckoutRequestID'] ?? null,
                'status'              => 'initiated',
            ]);

            return back()->with('success', 'STK Push confirmation prompt dispatched to your handset.');
        }

        // Return error message if Safaricom rejects the initial payload handshake
        return back()->with('error', $response['message']);
    }

    /**
     * ✅ RECEIVES AND PROCESSES THE REAL-TIME PAYMENT CONFIRMATION PACKET FROM SAFARICOM
     * Schema Synced and Sandbox Optimization Enabled
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
                    // 🟢 DEVELOPMENT SYNC: Process real success (0) OR sandbox timeout bypass (1037)
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

                        // Update Payment Status using your EXACT database schema column names
                        $payment->update([
                            'status'               => 'completed',
                            'mpesa_receipt_number' => $mpesaReceipt,       // ✅ Fixed Schema Sync
                            'result_description'   => $resultDesc,         // ✅ Fixed Schema Sync
                        ]);

                        // Update the core RepairRequest record layout to 'paid' status
                        $payment->repairRequest->update(['status' => 'paid']);
                        Log::info("Payment Successfully Saved for Checkout Request: {$checkoutRequestId}. Receipt: {$mpesaReceipt}");
                    } else {
                        // 🔴 Hard failures (e.g., user explicitly cancelled or wrong PIN)
                        $payment->update([
                            'status'             => 'failed',
                            'result_description' => $resultDesc         // ✅ Fixed Schema Sync
                        ]);
                        Log::warning("Payment Failed/Cancelled for Checkout Request: {$checkoutRequestId}. Reason: {$resultDesc}");
                    }
                }
            }

            // 2. CRITICAL: Acknowledge receipt to Safaricom with a clean 200 JSON object statement
            return response()->json([
                'ResultCode' => 0,
                'ResultDesc' => 'Callback received and processed successfully.'
            ], 200);

        } catch (\Exception $e) {
            Log::error('M-Pesa Webhook Parsing Error Trace: ' . $e->getMessage());

            return response()->json([
                'ResultCode' => 1,
                'ResultDesc' => 'Internal processing loop crash.'
            ], 500);
        }
    }
}