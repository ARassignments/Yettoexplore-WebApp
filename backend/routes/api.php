<?php

use App\Http\Controllers\Api\V1\AdminDashboardController;
use App\Http\Controllers\Api\V1\AgencyDashboardController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BookingController;
use App\Http\Controllers\Api\V1\TourController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - V1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // --- Public Authentication Routes ---
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/google', [AuthController::class, 'google']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    });

    // --- Public Tour Discovery & Destinations ---
    Route::get('/destinations', [TourController::class, 'destinations']);
    Route::prefix('tours')->group(function () {
        Route::get('/', [TourController::class, 'index']);
        Route::get('/featured', [TourController::class, 'featured']);
        Route::get('/destinations', [TourController::class, 'destinations']);
        Route::get('/{slugOrId}', [TourController::class, 'show']);
    });

    // --- Booking Endpoints & Coupon Validation ---
    Route::post('/bookings/validate-coupon', [BookingController::class, 'validateCoupon']);
    Route::post('/bookings/initiate', [BookingController::class, 'store']);

    // --- Super Admin Direct / SaaS Operations ---
    Route::prefix('admin')->group(function () {
        Route::get('/stats', [AdminDashboardController::class, 'stats']);
        Route::get('/agencies', [AdminDashboardController::class, 'agencies']);
        Route::post('/agencies/{id}/update', [AdminDashboardController::class, 'updateAgency']);
        Route::get('/tours', [AdminDashboardController::class, 'tours']);
        Route::post('/tours/{id}/update', [AdminDashboardController::class, 'updateTour']);
        Route::get('/bookings', [AdminDashboardController::class, 'bookings']);
        Route::get('/users', [AdminDashboardController::class, 'users']);
        Route::post('/users/{id}/update', [AdminDashboardController::class, 'updateUser']);
        Route::get('/coupons', [AdminDashboardController::class, 'coupons']);
        Route::post('/coupons', [AdminDashboardController::class, 'createCoupon']);
    });

    // --- Authenticated Traveler & SaaS Routes ---
    Route::middleware('auth:sanctum')->group(function () {

        // User profile & session
        Route::prefix('auth')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });

        // Booking Engine
        Route::prefix('bookings')->group(function () {
            Route::post('/', [BookingController::class, 'store']);
            Route::get('/my-bookings', [BookingController::class, 'myBookings']);
            Route::get('/{idOrNumber}', [BookingController::class, 'show']);
            Route::post('/{id}/cancel', [BookingController::class, 'cancel']);
        });

        // Tour Management
        Route::post('/tours', [TourController::class, 'store']);

        // Agency SaaS Dashboard Endpoints
        Route::prefix('agency')->group(function () {
            Route::get('/stats', [AgencyDashboardController::class, 'stats']);
            Route::get('/bookings', [AgencyDashboardController::class, 'bookings']);
            Route::post('/bookings/{id}/status', [AgencyDashboardController::class, 'updateBookingStatus']);
            Route::get('/tours', [AgencyDashboardController::class, 'tours']);
        });
    });
});
