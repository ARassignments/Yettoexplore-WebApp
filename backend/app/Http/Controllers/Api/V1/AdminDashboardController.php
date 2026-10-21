<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Models\Booking;
use App\Models\Coupon;
use App\Models\Destination;
use App\Models\Tour;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    /**
     * Get Platform-Wide KPI Analytics for Super Admin.
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        // Platform Totals
        $totalGMV = Booking::where('payment_status', 'paid')->sum('total_amount');
        $totalBookings = Booking::count();
        $confirmedBookings = Booking::where('status', 'confirmed')->count();
        $totalAgencies = Agency::count();
        $verifiedAgencies = Agency::where('is_verified', true)->count();
        $totalTours = Tour::count();
        $activeTours = Tour::where('status', 'active')->count();
        $totalUsers = User::count();
        $totalTravelers = User::where('role', 'customer')->count();
        $totalPassengers = Booking::sum('adults_count') + Booking::sum('children_count');
        $totalCommissionEarned = Booking::where('payment_status', 'paid')
            ->join('agencies', 'bookings.agency_id', '=', 'agencies.id')
            ->selectRaw('SUM(bookings.total_amount * (agencies.commission_rate / 100)) as commission')
            ->value('commission') ?? ($totalGMV * 0.10);

        // Recent Bookings across all agencies
        $recentBookings = Booking::with([
            'tour:id,title,cover_image,category,destination_id',
            'tour.destination:id,name',
            'agency:id,name,is_verified',
            'user:id,name,email,phone,avatar',
            'passengers'
        ])
            ->latest()
            ->limit(8)
            ->get();

        // Top Performing Agencies
        $topAgencies = Agency::withCount(['tours', 'bookings'])
            ->withSum(['bookings' => function ($q) {
                $q->where('payment_status', 'paid');
            }], 'total_amount')
            ->orderBy('bookings_sum_total_amount', 'desc')
            ->limit(5)
            ->get();

        // Destinations Overview
        $destinations = Destination::withCount('tours')
            ->orderBy('tours_count', 'desc')
            ->limit(6)
            ->get();

        // Recent Users
        $recentUsers = User::with('agency:id,name')
            ->latest()
            ->limit(6)
            ->get();

        return response()->json([
            'success' => true,
            'stats' => [
                'total_gmv' => (float) $totalGMV,
                'total_bookings' => (int) $totalBookings,
                'confirmed_bookings' => (int) $confirmedBookings,
                'total_agencies' => (int) $totalAgencies,
                'verified_agencies' => (int) $verifiedAgencies,
                'total_tours' => (int) $totalTours,
                'active_tours' => (int) $activeTours,
                'total_users' => (int) $totalUsers,
                'total_travelers' => (int) $totalTravelers,
                'total_passengers' => (int) $totalPassengers,
                'total_commission' => (float) round($totalCommissionEarned, 2),
            ],
            'recent_bookings' => $recentBookings,
            'top_agencies' => $topAgencies,
            'destinations' => $destinations,
            'recent_users' => $recentUsers,
        ]);
    }

    /**
     * Get All SaaS Agencies with management metadata.
     */
    public function agencies(Request $request): JsonResponse
    {
        $agencies = Agency::withCount(['tours', 'bookings', 'users'])
            ->withSum(['bookings' => function ($q) {
                $q->where('payment_status', 'paid');
            }], 'total_amount')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'count' => $agencies->count(),
            'data' => $agencies,
        ]);
    }

    /**
     * Toggle Agency Verification or Update Status.
     */
    public function updateAgency(Request $request, int $id): JsonResponse
    {
        $agency = Agency::findOrFail($id);

        if ($request->has('is_verified')) {
            $agency->is_verified = $request->boolean('is_verified');
        }

        if ($request->has('status')) {
            $agency->status = $request->input('status');
        }

        if ($request->has('commission_rate')) {
            $agency->commission_rate = (float) $request->input('commission_rate');
        }

        if ($request->has('subscription_tier')) {
            $agency->subscription_tier = $request->input('subscription_tier');
        }

        $agency->save();

        return response()->json([
            'success' => true,
            'message' => "Agency '{$agency->name}' updated successfully.",
            'data' => $agency,
        ]);
    }

    /**
     * Get All Tours across platform for Super Admin.
     */
    public function tours(Request $request): JsonResponse
    {
        $query = Tour::with(['agency:id,name,rating,is_verified,city', 'destination:id,name,city', 'batches']);

        if ($request->filled('agency_id')) {
            $query->where('agency_id', $request->input('agency_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $tours = $query->latest()->get();

        return response()->json([
            'success' => true,
            'count' => $tours->count(),
            'data' => $tours,
        ]);
    }

    /**
     * Toggle Tour Featured status or Active status.
     */
    public function updateTour(Request $request, int $id): JsonResponse
    {
        $tour = Tour::findOrFail($id);

        if ($request->has('is_featured')) {
            $tour->is_featured = $request->boolean('is_featured');
        }

        if ($request->has('status')) {
            $tour->status = $request->input('status');
        }

        $tour->save();

        return response()->json([
            'success' => true,
            'message' => "Tour '{$tour->title}' updated successfully.",
            'data' => $tour,
        ]);
    }

    /**
     * Get All Global Bookings.
     */
    public function bookings(Request $request): JsonResponse
    {
        $query = Booking::with([
            'tour:id,title,cover_image,duration_days',
            'agency:id,name,email,phone',
            'user:id,name,email,phone',
            'passengers',
            'batch'
        ]);

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
     * Get All Users across platform.
     */
    public function users(Request $request): JsonResponse
    {
        $users = User::with('agency:id,name')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'count' => $users->count(),
            'data' => $users,
        ]);
    }

    /**
     * Toggle User Active Status or Update Role.
     */
    public function updateUser(Request $request, int $id): JsonResponse
    {
        $targetUser = User::findOrFail($id);

        if ($request->has('is_active')) {
            $targetUser->is_active = $request->boolean('is_active');
        }

        if ($request->has('role')) {
            $targetUser->role = $request->input('role');
        }

        $targetUser->save();

        return response()->json([
            'success' => true,
            'message' => "User '{$targetUser->name}' updated successfully.",
            'data' => $targetUser->load('agency'),
        ]);
    }

    /**
     * Get All Promo Coupons.
     */
    public function coupons(Request $request): JsonResponse
    {
        $coupons = Coupon::with('agency:id,name')->latest()->get();

        return response()->json([
            'success' => true,
            'count' => $coupons->count(),
            'data' => $coupons,
        ]);
    }

    /**
     * Create Promo Coupon.
     */
    public function createCoupon(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons,code',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:1',
            'min_spend' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
        ]);

        $coupon = Coupon::create([
            'code' => strtoupper(trim($validated['code'])),
            'discount_type' => $validated['discount_type'],
            'discount_value' => $validated['discount_value'],
            'min_spend' => $validated['min_spend'] ?? 0,
            'max_discount' => $validated['max_discount'] ?? null,
            'usage_limit' => $validated['usage_limit'] ?? 100,
            'used_count' => 0,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Coupon '{$coupon->code}' created successfully.",
            'data' => $coupon,
        ], 201);
    }
}
