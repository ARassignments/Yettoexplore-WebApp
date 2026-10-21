<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'price',
        'currency',
        'billing_cycle',
        'modules_included',
        'staff_limit',
        'commission_rate',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'commission_rate' => 'decimal:2',
            'modules_included' => 'array',
            'staff_limit' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function agencies(): HasMany
    {
        return $this->hasMany(Agency::class);
    }
}
