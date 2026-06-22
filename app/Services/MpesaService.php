<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MpesaService
{
    protected $consumerKey;
    protected $consumerSecret;
    protected $shortcode;
    protected $passkey;
    protected $callbackUrl;
    protected $baseUrl;

    public function __construct()
    {
        // Automatically reads the variables you saved in your .env file
        $this->consumerKey = env('MPESA_CONSUMER_KEY');
        $this->consumerSecret = env('MPESA_CONSUMER_SECRET');
        $this->shortcode = env('MPESA_SHORTCODE', '174379');
        $this->passkey = env('MPESA_PASSKEY');
        $this->callbackUrl = env('MPESA_CALLBACK_URL');
        
        // 🔍 DEBUG LOG: Verifies if Laravel is successfully reading your .env values
        Log::info('--- Testing M-Pesa Variable Load ---', [
            'shortcode' => $this->shortcode,
            'passkey_length' => strlen($this->passkey ?? ''),
        ]);
        
        // Base API endpoint for the Safaricom Developer Sandbox
        $this->baseUrl = 'https://sandbox.safaricom.co.ke';
    }

    /**
     * Step 3A: Generate the mandatory OAuth Access Token from Safaricom
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
     * Step 3B: Initiate the Lipa Na M-Pesa Online STK Push prompt
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
            'BusinessShortCode' => $this->shortcode,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'TransactionType' => 'CustomerPayBillOnline',
            'Amount' => round($amount),
            'PartyA' => $formattedPhone,
            'PartyB' => $this->shortcode,
            'PhoneNumber' => $formattedPhone,
            'CallBackURL' => $this->callbackUrl,
            'AccountReference' => $accountReference,
            'TransactionDesc' => "Payment for Repair Job ID " . $requestId
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