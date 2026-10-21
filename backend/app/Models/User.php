<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'agency_id',
        'branch_id',
        'name',
        'email',
        'phone',
        'role',
        'avatar',
        'is_active',
        'profile_completed',
        'cnic_passport',
        'designation',
        'bank_details',
        'google_id',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
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
            'is_active' => 'boolean',
            'profile_completed' => 'boolean',
            'bank_details' => 'array',
        ];
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function moduleAccess(): HasMany
    {
        return $this->hasMany(StaffModuleAccess::class, 'staff_id');
    }

    /**
     * Check if user has permission on a specific module (Owner-assigned).
     */
    public function hasModulePermission(string $module, string $action = 'view'): bool
    {
        // Super Admin & Agency Owner have full access to everything in their scope
        if ($this->isSuperAdmin() || $this->isAgencyOwner()) {
            return true;
        }

        $access = $this->moduleAccess->firstWhere('module', $module);
        if (!$access) {
            return false;
        }

        return match ($action) {
            'view' => $access->can_view,
            'add_edit' => $access->can_add_edit,
            'book' => $access->can_book,
            'approve_refund' => $access->can_approve_refund,
            default => false,
        };
    }

    // --- Role Helpers ---

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isPlatformSupport(): bool
    {
        return $this->role === 'platform_support';
    }

    public function isAgencyOwner(): bool
    {
        return $this->role === 'agency_owner';
    }

    public function isOperationalManager(): bool
    {
        return $this->role === 'operational_manager';
    }

    public function isSalesAgent(): bool
    {
        return $this->role === 'sales_agent' || $this->role === 'agency_agent';
    }

    public function isAccountant(): bool
    {
        return $this->role === 'accountant';
    }

    public function isDriver(): bool
    {
        return $this->role === 'driver';
    }

    public function isCorporateAdmin(): bool
    {
        return $this->role === 'corporate_admin';
    }

    public function isCorporateEmployee(): bool
    {
        return $this->role === 'corporate_employee';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }
}
