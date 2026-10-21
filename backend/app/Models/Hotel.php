<?php

namespace App\Models;

use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hotel extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'agency_id',
        'destination_id',
        'name',
        'slug',
        'city',
        'address',
        'star_rating',
        'cover_image',
        'gallery',
        'description',
        'amenities',
        'policies',
        'is_featured',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'gallery' => 'array',
            'amenities' => 'array',
            'policies' => 'array',
            'is_featured' => 'boolean',
            'star_rating' => 'decimal:1',
        ];
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class);
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(HotelRoom::class);
    }
}
