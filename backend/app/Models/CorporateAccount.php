<?php

namespace App\Models;

use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CorporateAccount extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'agency_id',
        'company_name',
        'company_code',
        'ntn_tax_id',
        'contact_name',
        'contact_email',
        'contact_phone',
        'address',
        'credit_limit',
        'current_balance',
        'discount_rate_percentage',
        'requires_approval',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'credit_limit' => 'decimal:2',
            'current_balance' => 'decimal:2',
            'discount_rate_percentage' => 'decimal:2',
            'requires_approval' => 'boolean',
        ];
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }
}
