<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\HotelQuota;
use App\Models\HotelRoom;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class HotelController extends Controller
{
    /**
     * List all hotels (public or tenant-scoped).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Hotel::with(['rooms.quotas', 'destination']);

        if ($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        if ($request->filled('star_rating')) {
            $query->where('star_rating', '>=', $request->star_rating);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $hotels = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $hotels->items(),
            'meta' => [
                'current_page' => $hotels->currentPage(),
                'total' => $hotels->total(),
                'last_page' => $hotels->lastPage(),
            ],
        ]);
    }

    /**
     * Get single hotel details.
     */
    public function show(string $idOrSlug): JsonResponse
    {
        $hotel = Hotel::with(['rooms.quotas', 'destination', 'agency'])
            ->where('id', $idOrSlug)
            ->orWhere('slug', $idOrSlug)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $hotel,
        ]);
    }

    /**
     * Store new hotel (Agency staff / owner).
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user->agency_id && $user->role !== 'super_admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized agency account.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'address' => 'nullable|string',
            'destination_id' => 'nullable|exists:destinations,id',
            'star_rating' => 'nullable|numeric|min:1|max:5',
            'cover_image' => 'nullable|string',
            'gallery' => 'nullable|array',
            'description' => 'nullable|string',
            'amenities' => 'nullable|array',
            'policies' => 'nullable|array',
        ]);

        $validated['agency_id'] = $user->agency_id ?? $request->input('agency_id');
        $validated['slug'] = Str::slug($validated['name']) . '-' . Str::random(5);

        $hotel = Hotel::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Hotel created successfully.',
            'data' => $hotel,
        ], 201);
    }

    /**
     * Add room type to hotel.
     */
    public function storeRoom(Request $request, int $hotelId): JsonResponse
    {
        $hotel = Hotel::findOrFail($hotelId);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'room_type' => 'required|in:single,double,twin,triple,suite,family',
            'max_adults' => 'required|integer|min:1',
            'max_children' => 'nullable|integer|min:0',
            'base_price_per_night' => 'required|numeric|min:0',
            'total_rooms' => 'required|integer|min:1',
            'amenities' => 'nullable|array',
            'images' => 'nullable|array',
        ]);

        $room = $hotel->rooms()->create($validated);

        // Pre-populate 30 days quota calendar
        $today = Carbon::today();
        for ($i = 0; $i < 30; $i++) {
            HotelQuota::create([
                'hotel_room_id' => $room->id,
                'date' => $today->copy()->addDays($i)->toDateString(),
                'total_rooms' => $room->total_rooms,
                'available_rooms' => $room->total_rooms,
                'is_blocked' => false,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Room created with 30-day quota calendar initialized.',
            'data' => $room->load('quotas'),
        ], 201);
    }

    /**
     * Update room quota / availability for specific date.
     */
    public function updateQuota(Request $request, int $roomId): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'available_rooms' => 'required|integer|min:0',
            'price_override' => 'nullable|numeric|min:0',
            'is_blocked' => 'nullable|boolean',
        ]);

        $quota = HotelQuota::updateOrCreate(
            ['hotel_room_id' => $roomId, 'date' => $validated['date']],
            [
                'available_rooms' => $validated['available_rooms'],
                'price_override' => $validated['price_override'] ?? null,
                'is_blocked' => $validated['is_blocked'] ?? false,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Room quota updated.',
            'data' => $quota,
        ]);
    }
}
