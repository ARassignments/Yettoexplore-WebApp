<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Agency extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'logo',
        'cover_image',
        'email',
        'phone',
        'address',
        'city',
        'country_region',
        'currency',
        'license_number',
        'rating',
        'total_reviews',
        'is_verified',
        'commission_rate',
        'subscription_tier',
        'subscription_plan_id',
        'trial_status',
        'trial_ends_at',
        'is_permanently_free',
        'branding',
        'custom_domain',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'decimal:2',
            'total_reviews' => 'integer',
            'is_verified' => 'boolean',
            'commission_rate' => 'decimal:2',
            'is_permanently_free' => 'boolean',
            'trial_ends_at' => 'datetime',
            'branding' => 'array',
        ];
    }

    public function subscriptionPlan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function staff(): HasMany
    {
        return $this->hasMany(User::class)->whereNotIn('role', ['customer']);
    }

    public function tours(): HasMany
    {
        return $this->hasMany(Tour::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function coupons(): HasMany
    {
        return $this->hasMany(Coupon::class);
    }

    public function staffModuleAccess(): HasMany
    {
        return $this->hasMany(StaffModuleAccess::class);
    }

    public function hotels(): HasMany
    {
        return $this->hasMany(Hotel::class);
    }

    public function flights(): HasMany
    {
        return $this->hasMany(Flight::class);
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(Vehicle::class);
    }

    public function drivers(): HasMany
    {
        return $this->hasMany(Driver::class);
    }

    public function corporateAccounts(): HasMany
    {
        return $this->hasMany(CorporateAccount::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /**
     * Check if free trial is currently active.
     */
    public function isTrialActive(): bool
    {
        if ($this->is_permanently_free) {
            return true;
        }

        if ($this->trial_status === 'trialing' && $this->trial_ends_at) {
            return Carbon::now()->lessThanOrEqualTo($this->trial_ends_at);
        }

        return false;
    }

    /**
     * Check if agency trial is expired and locked.
     */
    public function isTrialExpired(): bool
    {
        if ($this->is_permanently_free) {
            return false;
        }

        if ($this->trial_status === 'trialing' && $this->trial_ends_at) {
            return Carbon::now()->greaterThan($this->trial_ends_at);
        }

        return $this->trial_status === 'expired' || $this->status === 'locked';
    }

    /**
     * Calculate days/hours remaining in trial.
     */
    public function trialRemaining(): array
    {
        if ($this->is_permanently_free) {
            return ['days' => 999, 'hours' => 0, 'is_expired' => false, 'is_free' => true];
        }

        if (!$this->trial_ends_at) {
            return ['days' => 0, 'hours' => 0, 'is_expired' => false, 'is_free' => false];
        }

        $now = Carbon::now();
        if ($now->greaterThan($this->trial_ends_at)) {
            return ['days' => 0, 'hours' => 0, 'is_expired' => true, 'is_free' => false];
        }

        $days = $now->diffInDays($this->trial_ends_at);
        $hours = $now->copy()->addDays($days)->diffInHours($this->trial_ends_at);

        return [
            'days' => (int) $days,
            'hours' => (int) $hours,
            'is_expired' => false,
            'is_free' => false,
        ];
    }
}
