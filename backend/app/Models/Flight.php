<?php

namespace App\Models;

use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Flight extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'agency_id',
        'flight_number',
        'airline_name',
        'airline_logo',
        'departure_airport',
        'departure_city',
        'arrival_airport',
        'arrival_city',
        'departure_time',
        'arrival_time',
        'duration_minutes',
        'cabin_class',
        'baggage_kg',
        'adult_price',
        'child_price',
        'total_seats',
        'available_seats',
        'notes',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'departure_time' => 'datetime',
            'arrival_time' => 'datetime',
            'duration_minutes' => 'integer',
            'baggage_kg' => 'integer',
            'adult_price' => 'decimal:2',
            'child_price' => 'decimal:2',
            'total_seats' => 'integer',
            'available_seats' => 'integer',
        ];
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }
}
