<?php

use App\Http\Controllers\Api\V1\AdminDashboardController;
use App\Http\Controllers\Api\V1\AgencyDashboardController;
use App\Http\Controllers\Api\V1\AgencyStaffController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BookingController;
use App\Http\Controllers\Api\V1\SubscriptionPlanController;
use App\Http\Controllers\Api\V1\TourController;
use App\Http\Middleware\CheckTenantLocked;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - V1 (Yet To Explore Multi-Tenant Travel SaaS)
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // --- Public Authentication Routes (Customer Registration ONLY) ---
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/google', [AuthController::class, 'google']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    });

    // --- Public Subscription Plans (Pricing Table Discovery) ---
    Route::get('/plans', [SubscriptionPlanController::class, 'index']);

    // --- Public Tour Discovery & Destinations ---
    Route::get('/destinations', [TourController::class, 'destinations']);
    Route::prefix('tours')->group(function () {
        Route::get('/', [TourController::class, 'index']);
        Route::get('/featured', [TourController::class, 'featured']);
        Route::get('/destinations', [TourController::class, 'destinations']);
        Route::get('/{slugOrId}', [TourController::class, 'show']);
    });

    // --- Public Manual Inventory Discovery (Hotels, Flights, Vehicles) ---
    Route::get('/hotels', [\App\Http\Controllers\Api\V1\HotelController::class, 'index']);
    Route::get('/hotels/{idOrSlug}', [\App\Http\Controllers\Api\V1\HotelController::class, 'show']);
    Route::get('/flights', [\App\Http\Controllers\Api\V1\FlightController::class, 'index']);
    Route::get('/flights/{id}', [\App\Http\Controllers\Api\V1\FlightController::class, 'show']);
    Route::get('/vehicles', [\App\Http\Controllers\Api\V1\VehicleController::class, 'index']);

    // --- Booking Endpoints & Coupon Validation ---
    Route::post('/bookings/validate-coupon', [BookingController::class, 'validateCoupon']);
    Route::post('/bookings/initiate', [BookingController::class, 'store']);

    // ====================================================
    // PLATFORM MANAGEMENT REST APIs (Super Admin ONLY)
    // ====================================================
    Route::prefix('admin')->group(function () {
        // Platform Analytics & Metrics
        Route::get('/stats', [AdminDashboardController::class, 'stats']);

        // Organizations / Agencies Management (DogarX Pattern)
        Route::get('/agencies', [AdminDashboardController::class, 'agencies']);
        Route::post('/agencies', [AdminDashboardController::class, 'createAgency']);
        Route::post('/agencies/{id}/update', [AdminDashboardController::class, 'updateAgency']);
        Route::post('/agencies/{id}/extend-trial', [AdminDashboardController::class, 'extendTrial']);

        // SaaS Subscription Plans
        Route::get('/plans', [SubscriptionPlanController::class, 'index']);
        Route::post('/plans', [SubscriptionPlanController::class, 'store']);
        Route::put('/plans/{id}', [SubscriptionPlanController::class, 'update']);

        // Platform-wide Tours, Bookings & Users
        Route::get('/tours', [AdminDashboardController::class, 'tours']);
        Route::post('/tours/{id}/update', [AdminDashboardController::class, 'updateTour']);
        Route::get('/bookings', [AdminDashboardController::class, 'bookings']);
        Route::get('/users', [AdminDashboardController::class, 'users']);
        Route::post('/users/{id}/update', [AdminDashboardController::class, 'updateUser']);
        Route::get('/coupons', [AdminDashboardController::class, 'coupons']);
        Route::post('/coupons', [AdminDashboardController::class, 'createCoupon']);
    });

    // ====================================================
    // AUTHENTICATED USER & TENANT WORKSPACE ROUTES
    // ====================================================
    Route::middleware('auth:sanctum')->group(function () {

        // User profile & session
        Route::prefix('auth')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });

        // Traveler Bookings Engine
        Route::prefix('bookings')->group(function () {
            Route::post('/', [BookingController::class, 'store']);
            Route::get('/my-bookings', [BookingController::class, 'myBookings']);
            Route::get('/{idOrNumber}', [BookingController::class, 'show']);
            Route::post('/{id}/cancel', [BookingController::class, 'cancel']);
        });

        // Tour Management
        Route::post('/tours', [TourController::class, 'store']);

        // ====================================================
        // AGENCY TENANT WORKSPACE (Checked by CheckTenantLocked)
        // ====================================================
        Route::middleware(CheckTenantLocked::class)->prefix('agency')->group(function () {
            Route::get('/stats', [AgencyDashboardController::class, 'stats']);
            Route::get('/bookings', [AgencyDashboardController::class, 'bookings']);
            Route::post('/bookings/{id}/status', [AgencyDashboardController::class, 'updateBookingStatus']);
            Route::get('/tours', [AgencyDashboardController::class, 'tours']);

            // Staff & Custom Module Permissions Management (Section 3.2)
            Route::get('/staff', [AgencyStaffController::class, 'index']);
            Route::post('/staff', [AgencyStaffController::class, 'store']);
            Route::post('/staff/{id}/permissions', [AgencyStaffController::class, 'updatePermissions']);
            Route::post('/staff/{id}/toggle-status', [AgencyStaffController::class, 'toggleStatus']);

            // Manual Inventory: Hotels & Room Quotas
            Route::post('/hotels', [\App\Http\Controllers\Api\V1\HotelController::class, 'store']);
            Route::post('/hotels/{id}/rooms', [\App\Http\Controllers\Api\V1\HotelController::class, 'storeRoom']);
            Route::post('/hotels/rooms/{roomId}/quota', [\App\Http\Controllers\Api\V1\HotelController::class, 'updateQuota']);

            // Manual Inventory: Flights
            Route::post('/flights', [\App\Http\Controllers\Api\V1\FlightController::class, 'store']);

            // Manual Inventory: Vehicles & Drivers
            Route::post('/vehicles', [\App\Http\Controllers\Api\V1\VehicleController::class, 'store']);
            Route::get('/drivers', [\App\Http\Controllers\Api\V1\VehicleController::class, 'drivers']);

            // Corporate Travel Module
            Route::get('/corporate', [\App\Http\Controllers\Api\V1\CorporateController::class, 'index']);
            Route::post('/corporate', [\App\Http\Controllers\Api\V1\CorporateController::class, 'store']);

            // Invoices & Billing
            Route::get('/invoices', [\App\Http\Controllers\Api\V1\InvoiceController::class, 'index']);
            Route::post('/invoices', [\App\Http\Controllers\Api\V1\InvoiceController::class, 'store']);
            Route::post('/invoices/{id}/mark-paid', [\App\Http\Controllers\Api\V1\InvoiceController::class, 'markAsPaid']);

            // Free Trial Status Widget (Section 10.5 - visible only to Owner)
            Route::get('/trial-status', function (Request $request) {
                $agency = $request->user()->agency;
                if (!$agency) {
                    return response()->json(['success' => false, 'message' => 'No agency associated'], 404);
                }
                return response()->json([
                    'success' => true,
                    'data' => [
                        'agency_name' => $agency->name,
                        'trial_status' => $agency->trial_status,
                        'trial_ends_at' => $agency->trial_ends_at,
                        'is_permanently_free' => $agency->is_permanently_free,
                        'trial_remaining' => $agency->trialRemaining(),
                        'plan' => $agency->subscriptionPlan,
                    ],
                ]);
            });
        });
    });
});
