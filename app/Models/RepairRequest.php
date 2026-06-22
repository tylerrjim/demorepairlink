<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class RepairRequest extends Model
{
    protected $fillable = [
        'user_id',
        'contractor_id',
        'title',
        'description',
        'category',
        'location',          
        'landmark',          // ✅ ADD THIS: To store neighborhood landmarks
        'scheduled_date', 
        'status',
        'agreed_price',
        'price_confirmed_at',
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
     * ✅ ADD THIS RELATIONSHIP: A repair request can have multiple payment record attempts.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}