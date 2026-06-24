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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            
            // Relates the review to the specific job done
            $table->foreignId('repair_request_id')->constrained()->onDelete('cascade');
            
            // Relates the review to the Tenant who wrote it (pointing to users table)
            $table->foreignId('tenant_id')->constrained('users')->onDelete('cascade');
            
            // Relates the review to the Contractor being rated (pointing to users table)
            $table->foreignId('contractor_id')->constrained('users')->onDelete('cascade');
            
            // Restricts numbers to tiny integers (1 to 5) for star values
            $table->unsignedTinyInteger('rating'); 
            
            // Holds optional text feedback
            $table->text('review')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};