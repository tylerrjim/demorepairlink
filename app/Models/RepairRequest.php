<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Payment;
use App\Models\Review;

class RepairRequest extends Model
{
    protected $fillable = [
        'user_id',
        'contractor_id',
        'title',
        'description',
        'category',
        'location',          
        'landmark',          // To store neighborhood landmarks
        'scheduled_date', 
        'status',
        'agreed_price',
        'price_confirmed_at',
        'latitude',          // 👈 Added for GPS integration
        'longitude',         // 👈 Added for GPS integration
    ];

    /**
     * The attributes that should be cast to native types.
     * Keeps dates behaving as authentic Carbon instances.
     */
    protected $casts = [
        'price_confirmed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contractor()
    {
        return $this->belongsTo(User::class, 'contractor_id');
    }

    /**
     * A repair request can have multiple payment record attempts.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * ✅ ADDED FOR STEP 2: A repair request can have one rating/review feedback entry.
     */
    public function review()
    {
        return $this->hasOne(Review::class, 'repair_request_id');
    }
}