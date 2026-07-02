<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\ContractorProfile;
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'phone', 
        'cv_path', // Added phone to fillable attributes
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function contractorProfile()
{
    return $this->hasOne(ContractorProfile::class);
}

public function isAdmin(): bool
{
    return $this->role === 'admin';
}

public function isContractor(): bool
{
    return $this->role === 'contractor';
}

public function isTenant(): bool
{
    return $this->role === 'tenant';
}

public function isPending(): bool
{
    return $this->status === 'pending';
}

public function isApproved(): bool
{
    return $this->status === 'active';
}
}
