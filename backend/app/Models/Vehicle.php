<?php

namespace App\Models;

use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Vehicle extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'agency_id',
        'name',
        'make',
        'model_year',
        'type',
        'license_plate',
        'seats_capacity',
        'luggage_capacity',
        'transmission',
        'fuel_type',
        'daily_rate',
        'with_driver',
        'cover_image',
        'features',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'with_driver' => 'boolean',
            'daily_rate' => 'decimal:2',
            'model_year' => 'integer',
            'seats_capacity' => 'integer',
            'luggage_capacity' => 'integer',
        ];
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }
}
