<?php

namespace App\Models;

use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tour extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'agency_id',
        'destination_id',
        'title',
        'slug',
        'category',
        'duration_days',
        'duration_nights',
        'group_size_max',
        'difficulty',
        'base_price',
        'discount_price',
        'cover_image',
        'gallery',
        'overview',
        'highlights',
        'inclusions',
        'exclusions',
        'meeting_point',
        'rating',
        'reviews_count',
        'is_featured',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'discount_price' => 'decimal:2',
            'rating' => 'decimal:2',
            'gallery' => 'array',
            'highlights' => 'array',
            'inclusions' => 'array',
            'exclusions' => 'array',
            'is_featured' => 'boolean',
            'duration_days' => 'integer',
            'duration_nights' => 'integer',
            'group_size_max' => 'integer',
            'reviews_count' => 'integer',
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

    public function itineraries(): HasMany
    {
        return $this->hasMany(TourItinerary::class)->orderBy('day_number');
    }

    public function batches(): HasMany
    {
        return $this->hasMany(TourBatch::class)->orderBy('start_date');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
