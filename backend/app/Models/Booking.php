<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_number',
        'user_id',
        'agency_id',
        'tour_id',
        'batch_id',
        'travel_date',
        'adults_count',
        'children_count',
        'subtotal',
        'discount_amount',
        'tax_amount',
        'total_amount',
        'coupon_code',
        'status',
        'payment_status',
        'payment_method',
        'special_requests',
        'qr_code_token',
    ];

    protected function casts(): array
    {
        return [
            'travel_date' => 'date',
            'adults_count' => 'integer',
            'children_count' => 'integer',
            'subtotal' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
        ];
    }

    protected static function booted()
    {
        static::creating(function ($booking) {
            if (empty($booking->booking_number)) {
                $booking->booking_number = 'YTE-' . strtoupper(Str::random(6));
            }
            if (empty($booking->qr_code_token)) {
                $booking->qr_code_token = 'YTE_PASS_' . (string) Str::uuid();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function tour(): BelongsTo
    {
        return $this->belongsTo(Tour::class);
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(TourBatch::class, 'batch_id');
    }

    public function passengers(): HasMany
    {
        return $this->hasMany(BookingPassenger::class);
    }
}
