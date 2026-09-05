<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\ContractorProfile;
use App\Models\Review;

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
        'name', // The user's name
        'email', // The user's email address
        'password', // The user's password (hashed)
        'role', // The user's role (e.g., admin, contractor, tenant)
        'status', // The user's account status (e.g., active, pending, suspended)
        'phone', // The user's phone number
        'cv_path', // Added cv_path to fillable attributes
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password', // The user's password (hidden for security)
        'remember_token', // Token used for "remember me" functionality (hidden for security)
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime', // Casts the email_verified_at attribute to a Carbon datetime instance
            'password' => 'hashed', // Casts the password attribute to a hashed value for security
        ];
    }

    // Relationship: A user can have one contractor profile (if they are a contractor).
    public function contractorProfile()
    {
        return $this->hasOne(ContractorProfile::class);
    }

    // Relationship: Reviews received by this contractor from tenants
    public function reviewsReceived()
    {
        return $this->hasMany(Review::class, 'contractor_id');
    }

    // Accessor: Dynamically calculates auth()->user()->average_rating
    public function getAverageRatingAttribute(): float
    {
        return (float) round($this->reviewsReceived()->avg('rating') ?? 0, 1);
    }

    // Custom methods to check user roles and statuses
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