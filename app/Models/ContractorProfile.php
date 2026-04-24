<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContractorProfile extends Model
{
     protected $fillable = [
        'user_id',
        'phone',
        'trade',
        'years_of_experience',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
