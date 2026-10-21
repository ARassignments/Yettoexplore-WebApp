<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HotelRoom extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_id',
        'name',
        'room_type',
        'max_adults',
        'max_children',
        'base_price_per_night',
        'total_rooms',
        'amenities',
        'images',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'base_price_per_night' => 'decimal:2',
            'amenities' => 'array',
            'images' => 'array',
            'max_adults' => 'integer',
            'max_children' => 'integer',
            'total_rooms' => 'integer',
        ];
    }

    public function hotel(): BelongsTo
    {
        return $this->belongsTo(Hotel::class);
    }

    public function quotas(): HasMany
    {
        return $this->hasMany(HotelQuota::class);
    }
}
