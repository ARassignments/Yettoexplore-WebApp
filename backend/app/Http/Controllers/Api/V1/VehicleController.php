<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    /**
     * List vehicles for rent / transfers.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Vehicle::with('agency');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('with_driver')) {
            $query->where('with_driver', filter_var($request->with_driver, FILTER_VALIDATE_BOOLEAN));
        }

        $vehicles = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $vehicles->items(),
            'meta' => [
                'current_page' => $vehicles->currentPage(),
                'total' => $vehicles->total(),
            ],
        ]);
    }

    /**
     * List drivers for the agency.
     */
    public function drivers(Request $request): JsonResponse
    {
        $drivers = Driver::with('user')->get();

        return response()->json([
            'success' => true,
            'data' => $drivers,
        ]);
    }

    /**
     * Store new fleet vehicle.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user->agency_id && $user->role !== 'super_admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'make' => 'required|string|max:100',
            'model_year' => 'required|integer',
            'type' => 'required|in:sedan,suv,van,coaster,4x4_jeep',
            'license_plate' => 'nullable|string|max:50',
            'seats_capacity' => 'required|integer|min:1',
            'luggage_capacity' => 'nullable|integer',
            'transmission' => 'nullable|in:Automatic,Manual',
            'fuel_type' => 'nullable|in:Petrol,Diesel,Hybrid',
            'daily_rate' => 'required|numeric|min:0',
            'with_driver' => 'nullable|boolean',
            'cover_image' => 'nullable|string',
            'features' => 'nullable|array',
        ]);

        $validated['agency_id'] = $user->agency_id ?? $request->input('agency_id');
        $validated['status'] = 'available';

        $vehicle = Vehicle::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Vehicle registered successfully.',
            'data' => $vehicle,
        ], 201);
    }
}
