<?php

namespace App\Models;

use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Driver extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'agency_id',
        'user_id',
        'full_name',
        'phone',
        'license_number',
        'experience_years',
        'rating',
        'is_available',
    ];

    protected function casts(): array
    {
        return [
            'experience_years' => 'integer',
            'rating' => 'decimal:1',
            'is_available' => 'boolean',
        ];
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
