<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
        $table->id();
        // Links this payment directly back to the specific repair request
        $table->foreignId('repair_request_id')->constrained()->onDelete('cascade');
        
        $table->decimal('amount', 10, 2);
        $table->string('phone_number');
        
        // Tracking tokens returned by Safaricom Daraja API
        $table->string('merchant_request_id')->unique()->nullable();
        $table->string('checkout_request_id')->unique()->nullable();
        $table->string('mpesa_receipt_number')->unique()->nullable();
        
        // Transaction lifecycle status: 'initiated', 'completed', 'failed'
        $table->string('status')->default('initiated'); 
        $table->string('result_description')->nullable(); // Stores error info if the tenant cancels the prompt
        
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
