<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Flight;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FlightController extends Controller
{
    /**
     * List manual flight routes.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Flight::with('agency');

        if ($request->filled('from')) {
            $query->where(function ($q) use ($request) {
                $q->where('departure_city', 'like', '%' . $request->from . '%')
                  ->orWhere('departure_airport', 'like', '%' . $request->from . '%');
            });
        }

        if ($request->filled('to')) {
            $query->where(function ($q) use ($request) {
                $q->where('arrival_city', 'like', '%' . $request->to . '%')
                  ->orWhere('arrival_airport', 'like', '%' . $request->to . '%');
            });
        }

        if ($request->filled('date')) {
            $query->whereDate('departure_time', $request->date);
        }

        $flights = $query->orderBy('departure_time', 'asc')->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $flights->items(),
            'meta' => [
                'current_page' => $flights->currentPage(),
                'total' => $flights->total(),
            ],
        ]);
    }

    /**
     * Show single flight.
     */
    public function show(int $id): JsonResponse
    {
        $flight = Flight::with('agency')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $flight,
        ]);
    }

    /**
     * Store new flight route / seats (Agency manual entry).
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user->agency_id && $user->role !== 'super_admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'flight_number' => 'required|string|max:50',
            'airline_name' => 'required|string|max:100',
            'airline_logo' => 'nullable|string',
            'departure_airport' => 'required|string|max:10',
            'departure_city' => 'required|string|max:100',
            'arrival_airport' => 'required|string|max:10',
            'arrival_city' => 'required|string|max:100',
            'departure_time' => 'required|date',
            'arrival_time' => 'required|date|after:departure_time',
            'duration_minutes' => 'nullable|integer',
            'cabin_class' => 'nullable|in:Economy,Premium Economy,Business',
            'baggage_kg' => 'nullable|integer',
            'adult_price' => 'required|numeric|min:0',
            'child_price' => 'nullable|numeric|min:0',
            'total_seats' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $validated['agency_id'] = $user->agency_id ?? $request->input('agency_id');
        $validated['available_seats'] = $validated['total_seats'];
        $validated['status'] = 'scheduled';

        $flight = Flight::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Flight scheduled successfully.',
            'data' => $flight,
        ], 201);
    }
}
