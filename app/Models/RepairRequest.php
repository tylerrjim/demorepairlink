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
    'location',          // ✅ MUST BE HERE
    'scheduled_date', 
    'status',
];

public function user()
{
    return $this->belongsTo(User::class);
}

public function contractor()
{
    return $this->belongsTo(User::class, 'contractor_id');
}
}