<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingPassenger;
use App\Models\Coupon;
use App\Models\Tour;
use App\Models\TourBatch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    /**
     * Validate Promo Coupon Code.
     */
    public function validateCoupon(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Please provide a valid coupon code and subtotal.',
            ], 422);
        }

        $code = strtoupper(trim($request->input('code')));
        $subtotal = (float) $request->input('subtotal');

        $coupon = Coupon::where('code', $code)->where('is_active', true)->first();

        if (!$coupon) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired coupon code.'
            ], 404);
        }

        if (!$coupon->isValidForAmount($subtotal)) {
            $msg = 'Coupon conditions not met.';
            if ($coupon->min_spend > $subtotal) {
                $msg = 'Minimum spend of PKR ' . number_format($coupon->min_spend) . ' required for this coupon.';
            }
            return response()->json([
                'success' => false,
                'message' => $msg
            ], 422);
        }

        $discount = $coupon->calculateDiscount($subtotal);

        return response()->json([
            'success' => true,
            'message' => 'Coupon applied successfully!',
            'coupon' => [
                'code' => $coupon->code,
                'discount_type' => $coupon->discount_type,
                'discount_value' => $coupon->discount_value,
                'discount_amount' => $discount,
            ]
        ]);
    }

    /**
     * Create a new booking with passengers.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'tour_id' => 'required|exists:tours,id',
            'batch_id' => 'nullable|exists:tour_batches,id',
            'travel_date' => 'required|date',
            'adults_count' => 'required|integer|min:1',
            'children_count' => 'nullable|integer|min:0',
            'payment_method' => 'nullable|string|in:credit_card,easypaisa,jazzcash,bank_transfer,cash',
            'special_requests' => 'nullable|string|max:1000',
            'coupon_code' => 'nullable|string',
            'passengers' => 'required|array|min:1',
            'passengers.*.full_name' => 'required|string|max:255',
            'passengers.*.cnic_passport' => 'nullable|string|max:50',
            'passengers.*.gender' => 'nullable|string|in:Male,Female,Other',
            'passengers.*.is_lead' => 'nullable|boolean',
            'passengers.*.phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $userId = $user ? $user->id : ($request->input('user_id') ?: (\App\Models\User::where('role', 'customer')->first()->id ?? 1));
        $userPhone = $user ? $user->phone : '+92 300 1234567';

        $tour = Tour::with('agency')->findOrFail($request->input('tour_id'));
        $batch = null;

        if ($request->filled('batch_id')) {
            $batch = TourBatch::find($request->input('batch_id'));
        }

        $adultsCount = (int) $request->input('adults_count', 1);
        $childrenCount = (int) $request->input('children_count', 0);
        $totalSeatsRequested = $adultsCount + $childrenCount;

        // Check seat availability if batch is selected
        if ($batch && $batch->available_seats < $totalSeatsRequested) {
            return response()->json([
                'success' => false,
                'message' => 'Only ' . $batch->available_seats . ' seat(s) available for the selected batch date.'
            ], 422);
        }

        // Pricing calculation
        $unitPrice = $batch && $batch->price_override ? $batch->price_override : ($tour->discount_price ?: $tour->base_price);
        $subtotal = ($adultsCount * $unitPrice) + ($childrenCount * ($unitPrice * 0.75));

        // Coupon discount
        $discountAmount = 0;
        $couponCode = null;
        if ($request->filled('coupon_code')) {
            $coupon = Coupon::where('code', strtoupper(trim($request->input('coupon_code'))))->where('is_active', true)->first();
            if ($coupon && $coupon->isValidForAmount($subtotal)) {
                $discountAmount = $coupon->calculateDiscount($subtotal);
                $couponCode = $coupon->code;
                $coupon->increment('used_count');
            }
        }

        $taxAmount = 0; // Tax free / included
        $totalAmount = max(0, ($subtotal - $discountAmount) + $taxAmount);

        try {
            $booking = DB::transaction(function () use (
                $userId, $userPhone, $tour, $batch, $request, $adultsCount, $childrenCount,
                $subtotal, $discountAmount, $taxAmount, $totalAmount, $couponCode, $totalSeatsRequested
            ) {
                $booking = Booking::create([
                    'booking_number' => 'YTE-' . strtoupper(Str::random(6)),
                    'user_id' => $userId,
                    'agency_id' => $tour->agency_id,
                    'tour_id' => $tour->id,
                    'batch_id' => $batch ? $batch->id : null,
                    'travel_date' => $request->input('travel_date'),
                    'adults_count' => $adultsCount,
                    'children_count' => $childrenCount,
                    'subtotal' => $subtotal,
                    'discount_amount' => $discountAmount,
                    'tax_amount' => $taxAmount,
                    'total_amount' => $totalAmount,
                    'coupon_code' => $couponCode,
                    'status' => 'confirmed',
                    'payment_status' => 'paid',
                    'payment_method' => $request->input('payment_method', 'credit_card'),
                    'special_requests' => $request->input('special_requests'),
                    'qr_code_token' => 'YTE_PASS_' . strtoupper(Str::random(12)),
                ]);

                // Create passenger records
                $passengersData = $request->input('passengers', []);
                foreach ($passengersData as $index => $p) {
                    BookingPassenger::create([
                        'booking_id' => $booking->id,
                        'full_name' => $p['full_name'],
                        'cnic_passport' => $p['cnic_passport'] ?? null,
                        'gender' => $p['gender'] ?? 'Male',
                        'age' => $p['age'] ?? 25,
                        'is_lead' => $p['is_lead'] ?? ($index === 0),
                        'phone' => $p['phone'] ?? $userPhone,
                    ]);
                }

                // Decrement batch available seats
                if ($batch) {
                    $batch->decrement('available_seats', $totalSeatsRequested);
                    if ($batch->available_seats <= 0) {
                        $batch->update(['status' => 'sold_out']);
                    } elseif ($batch->available_seats <= 4) {
                        $batch->update(['status' => 'almost_full']);
                    }
                }

                return $booking;
            });

            $loadedBooking = $booking->load(['tour.destination', 'tour.agency', 'passengers', 'batch', 'user:id,name,email,phone']);

            return response()->json([
                'success' => true,
                'message' => 'Booking successfully confirmed! Your Digital Boarding Pass is ready.',
                'data' => [
                    'booking' => $loadedBooking,
                    'client_secret' => 'pi_mock_stripe_' . Str::random(24),
                ],
                'booking' => $loadedBooking,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete booking: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get bookings of currently authenticated traveler.
     */
    public function myBookings(Request $request): JsonResponse
    {
        $user = $request->user();

        $bookings = Booking::with(['tour.destination', 'tour.agency', 'passengers', 'batch'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'count' => $bookings->count(),
            'data' => $bookings,
        ]);
    }

    /**
     * Get single booking details with QR pass.
     */
    public function show(Request $request, string $idOrNumber): JsonResponse
    {
        $user = $request->user();

        $query = Booking::with(['tour.destination', 'tour.agency', 'passengers', 'batch', 'user:id,name,email,phone']);

        if (is_numeric($idOrNumber)) {
            $booking = $query->find($idOrNumber);
        } else {
            $booking = $query->where('booking_number', $idOrNumber)->orWhere('qr_code_token', $idOrNumber)->first();
        }

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found.'
            ], 404);
        }

        // Authorization check (must be booking owner, agency staff, or super admin)
        if ($booking->user_id !== $user->id && $booking->agency_id !== $user->agency_id && !$user->isSuperAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this booking.'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $booking,
        ]);
    }

    /**
     * Cancel a booking.
     */
    public function cancel(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $booking = Booking::with('batch')->findOrFail($id);

        if ($booking->user_id !== $user->id && !$user->isSuperAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized action'], 403);
        }

        if ($booking->status === 'cancelled') {
            return response()->json(['success' => false, 'message' => 'Booking is already cancelled.'], 400);
        }

        $booking->status = 'cancelled';
        $booking->payment_status = 'refunded';
        $booking->save();

        // Restore seats
        if ($booking->batch) {
            $seatsToRestore = $booking->adults_count + $booking->children_count;
            $booking->batch->increment('available_seats', $seatsToRestore);
            if ($booking->batch->available_seats > 4) {
                $booking->batch->update(['status' => 'open']);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Booking # ' . $booking->booking_number . ' has been cancelled.',
            'data' => $booking,
        ]);
    }
}
