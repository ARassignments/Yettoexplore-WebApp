<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HotelQuota extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_room_id',
        'date',
        'total_rooms',
        'available_rooms',
        'price_override',
        'is_blocked',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'total_rooms' => 'integer',
            'available_rooms' => 'integer',
            'price_override' => 'decimal:2',
            'is_blocked' => 'boolean',
        ];
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(HotelRoom::class, 'hotel_room_id');
    }
}
