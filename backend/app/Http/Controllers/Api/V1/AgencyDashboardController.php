<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Tour;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AgencyDashboardController extends Controller
{
    /**
     * Get Agency Analytics & KPI Summary.
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAgencyOwner() && !$user->isAgencyAgent() && !$user->isSuperAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access'], 403);
        }

        $agencyId = $user->isSuperAdmin() ? $request->input('agency_id', 1) : $user->agency_id;

        $totalTours = Tour::where('agency_id', $agencyId)->count();
        $totalBookings = Booking::where('agency_id', $agencyId)->count();
        $confirmedBookings = Booking::where('agency_id', $agencyId)->where('status', 'confirmed')->count();
        $totalRevenue = Booking::where('agency_id', $agencyId)->where('payment_status', 'paid')->sum('total_amount');
        $totalPassengers = Booking::where('agency_id', $agencyId)->sum('adults_count') + Booking::where('agency_id', $agencyId)->sum('children_count');

        $recentBookings = Booking::with(['tour:id,title,cover_image', 'user:id,name,email,phone', 'passengers'])
            ->where('agency_id', $agencyId)
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'stats' => [
                'total_tours' => $totalTours,
                'total_bookings' => $totalBookings,
                'confirmed_bookings' => $confirmedBookings,
                'total_revenue' => (float) $totalRevenue,
                'total_passengers' => (int) $totalPassengers,
            ],
            'recent_bookings' => $recentBookings,
        ]);
    }

    /**
     * Get all agency bookings.
     */
    public function bookings(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAgencyOwner() && !$user->isAgencyAgent() && !$user->isSuperAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access'], 403);
        }

        $agencyId = $user->isSuperAdmin() ? $request->input('agency_id', 1) : $user->agency_id;

        $query = Booking::with(['tour:id,title,cover_image,duration_days', 'user:id,name,email,phone', 'passengers', 'batch'])
            ->where('agency_id', $agencyId);

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->input('payment_status'));
        }

        $bookings = $query->latest()->get();

        return response()->json([
            'success' => true,
            'count' => $bookings->count(),
            'data' => $bookings,
        ]);
    }

    /**
     * Update booking status.
     */
    public function updateBookingStatus(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAgencyOwner() && !$user->isAgencyAgent() && !$user->isSuperAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access'], 403);
        }

        $booking = Booking::findOrFail($id);

        if (!$user->isSuperAdmin() && $booking->agency_id !== $user->agency_id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized action'], 403);
        }

        $status = $request->input('status');
        if ($status) {
            $booking->status = $status;
        }

        $paymentStatus = $request->input('payment_status');
        if ($paymentStatus) {
            $booking->payment_status = $paymentStatus;
        }

        $booking->save();

        return response()->json([
            'success' => true,
            'message' => 'Booking status updated successfully',
            'data' => $booking->load(['tour', 'user', 'passengers']),
        ]);
    }

    /**
     * Get agency tours.
     */
    public function tours(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAgencyOwner() && !$user->isAgencyAgent() && !$user->isSuperAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized access'], 403);
        }

        $agencyId = $user->isSuperAdmin() ? $request->input('agency_id', 1) : $user->agency_id;

        $tours = Tour::with(['destination', 'batches'])
            ->where('agency_id', $agencyId)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'count' => $tours->count(),
            'data' => $tours,
        ]);
    }
}
