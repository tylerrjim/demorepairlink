<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController; // ✅ Import your payment controller

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 💰 Safaricom Daraja Inbound Payment Webhook Listener
Route::post('/mpesa/callback', [PaymentController::class, 'handleCallback']);