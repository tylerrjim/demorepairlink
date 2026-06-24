<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'repair_request_id',
        'tenant_id',
        'contractor_id',
        'rating',
        'review',
    ];

    // A review belongs to a specific repair request
    public function repairRequest()
    {
        return $this->belongsTo(RepairRequest::class);
    }

    // A review belongs to a tenant (User)
    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    // A review belongs to a contractor (User)
    public function contractor()
    {
        return $this->belongsTo(User::class, 'contractor_id');
    }
}