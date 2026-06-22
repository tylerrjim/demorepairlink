<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'repair_request_id',
        'amount',
        'phone_number',
        'merchant_request_id',
        'checkout_request_id',
        'mpesa_receipt_number',
        'status',
        'result_description'
    ];

    /**
     * Relationship: A payment belongs to a specific repair request.
     */
    public function repairRequest()
    {
        return $this->belongsTo(RepairRequest::class);
    }
}