<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

// This service class encapsulates all interactions with the Safaricom M-Pesa Daraja API, including token generation and STK Push initiation.
class MpesaService
{
    protected $consumerKey;
    protected $consumerSecret;
    protected $shortcode;
    protected $passkey;
    protected $callbackUrl;
    protected $baseUrl;

// The constructor automatically reads the necessary M-Pesa credentials and configuration 
// from the .env file, ensuring that sensitive information is not hardcoded into the application.
    public function __construct()
    {
        // Automatically reads the variables you saved in your .env file
        $this->consumerKey = env('MPESA_CONSUMER_KEY');
        $this->consumerSecret = env('MPESA_CONSUMER_SECRET');
        $this->shortcode = env('MPESA_SHORTCODE', '174379');
        $this->passkey = env('MPESA_PASSKEY');
        $this->callbackUrl = env('MPESA_CALLBACK_URL');
        
        // Log the loaded variables for debugging purposes (do not log sensitive information in production)
        Log::info('--- Testing M-Pesa Variable Load ---', [
            'shortcode' => $this->shortcode,
            'passkey_length' => strlen($this->passkey ?? ''),
        ]);
        
        // Set the base URL for the M-Pesa API (sandbox for testing)
        $this->baseUrl = 'https://sandbox.safaricom.co.ke';
    }

    /**
     * Step 1: Generate a temporary Bearer Token for authenticating subsequent API requests
     * This token is valid for a limited time and must be refreshed periodically.
     */
    public function getAccessToken()
    {
        $url = $this->baseUrl . '/oauth/v1/generate?grant_type=client_credentials';
        
        try {
            // Uses standard Basic Auth (Consumer Key : Consumer Secret) as required by Daraja
            $response = Http::withBasicAuth($this->consumerKey, $this->consumerSecret)
                ->acceptJson()
                ->get($url);

            if ($response->successful()) {
                return $response->json()['access_token'];
            }

            Log::error('M-Pesa Token Generation Failed: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('M-Pesa Token Exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Step 2: Initiate an STK Push request to the tenant's mobile device
     * This method constructs the required payload and sends it to the M-Pesa API.
     */
    public function initiateStkPush($phone, $amount, $requestId, $accountReference = 'RepairLink')
    {
        // Fetch the temporary Bearer Token we generated above
        $accessToken = $this->getAccessToken();
        
        if (!$accessToken) {
            return [
                'success' => false,
                'message' => 'Failed to generate secure M-Pesa access token.'
            ];
        }

        $url = $this->baseUrl . '/mpesa/stkpush/v1/processrequest'; 

        // Sanitize the phone format into Safaricom standard (2547XXXXXXXX)
        $formattedPhone = $this->formatPhoneNumber($phone);
        
        // Generate security cryptographic parameters
        $timestamp = date('YmdHis');
        $password = base64_encode($this->shortcode . $this->passkey . $timestamp);

        // The precise JSON layout Daraja expects
        $payload = [
            'BusinessShortCode' => $this->shortcode,// The shortcode registered with Safaricom for your business
            'Password' => $password, // The base64-encoded string combining shortcode, passkey, and timestamp for security
            'Timestamp' => $timestamp,// The current timestamp in the format YYYYMMDDHHMMSS
            'TransactionType' => 'CustomerPayBillOnline',// The type of transaction being initiated
            'Amount' => round($amount), // The amount to be charged (rounded to the nearest whole number)
            'PartyA' => $formattedPhone, // The tenant's phone number initiating the payment
            'PartyB' => $this->shortcode, // The business shortcode receiving the payment
            'PhoneNumber' => $formattedPhone, // The same tenant phone number for confirmation
            'CallBackURL' => $this->callbackUrl, // The endpoint Safaricom will call to notify of payment success/failure
            'AccountReference' => $accountReference, // A reference string for the transaction (e.g., "RepairLink")
            'TransactionDesc' => "Payment for Repair Job ID " . $requestId // A human-readable description of the transaction for audit purposes
        ];

        try {
            $response = Http::withToken($accessToken)
                ->acceptJson()
                ->post($url, $payload);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json()
                ];
            }

            Log::error('M-Pesa STK Push Dispatch Failed: ' . $response->body());
            return [
                'success' => false,
                'message' => $response->json()['ResponseDescription'] ?? 'STK Push initialization failed.'
            ];

        } catch (\Exception $e) {
            Log::error('M-Pesa STK Push Exception: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Internal server error processing API handshake.'
            ];
        }
    }

    /**
     * Clean utility to automatically convert local Kenyan numbers to standard country routing blocks
     */
    private function formatPhoneNumber($phone)
    {
        $phone = preg_replace('/\s+/', '', $phone); // Strip out any empty spaces
        
        if (str_starts_with($phone, '07')) {
            return '254' . substr($phone, 1);
        }
        if (str_starts_with($phone, '01')) {
            return '254' . substr($phone, 1);
        }
        if (str_starts_with($phone, '+254')) {
            return substr($phone, 1);
        }
        
        return $phone;
    }
}