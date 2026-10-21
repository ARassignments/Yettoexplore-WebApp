<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\Tour;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TourController extends Controller
{
    /**
     * Get list of tours with filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Tour::with(['agency:id,name,rating,is_verified,city', 'destination:id,name,city,country', 'batches']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('overview', 'like', "%{$search}%")
                  ->orWhereHas('destination', function ($dq) use ($search) {
                      $dq->where('name', 'like', "%{$search}%")
                         ->orWhere('city', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filled('destination_id')) {
            $query->where('destination_id', $request->input('destination_id'));
        }

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        if ($request->filled('difficulty')) {
            $query->where('difficulty', $request->input('difficulty'));
        }

        if ($request->filled('max_price')) {
            $query->where('base_price', '<=', $request->input('max_price'));
        }

        if ($request->filled('min_price')) {
            $query->where('base_price', '>=', $request->input('min_price'));
        }

        if ($request->boolean('is_featured')) {
            $query->where('is_featured', true);
        }

        // Only active tours for public
        $query->where('status', 'active');

        // Sorting
        $sortBy = $request->input('sort_by', 'popular');
        if ($sortBy === 'price_low') {
            $query->orderBy('base_price', 'asc');
        } elseif ($sortBy === 'price_high') {
            $query->orderBy('base_price', 'desc');
        } elseif ($sortBy === 'rating') {
            $query->orderBy('rating', 'desc');
        } elseif ($sortBy === 'duration') {
            $query->orderBy('duration_days', 'desc');
        } else {
            $query->orderBy('is_featured', 'desc')->orderBy('rating', 'desc')->latest();
        }

        $tours = $query->get();

        return response()->json([
            'success' => true,
            'count' => $tours->count(),
            'data' => $tours,
        ]);
    }

    /**
     * Get featured tours.
     */
    public function featured(): JsonResponse
    {
        $tours = Tour::with(['agency:id,name,rating,is_verified,city', 'destination:id,name,city,country', 'batches'])
            ->where('is_featured', true)
            ->where('status', 'active')
            ->limit(6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $tours,
        ]);
    }

    /**
     * Get list of destinations with tours count.
     */
    public function destinations(): JsonResponse
    {
        $destinations = Destination::withCount(['tours' => function ($q) {
            $q->where('status', 'active');
        }])->get();

        return response()->json([
            'success' => true,
            'data' => $destinations,
        ]);
    }

    /**
     * Get single tour details.
     */
    public function show(string $slugOrId): JsonResponse
    {
        $query = Tour::with([
            'agency',
            'destination',
            'itineraries',
            'batches' => function ($q) {
                $q->where('start_date', '>=', now()->toDateString())
                  ->orderBy('start_date', 'asc');
            }
        ]);

        if (is_numeric($slugOrId)) {
            $tour = $query->find($slugOrId);
        } else {
            $tour = $query->where('slug', $slugOrId)->first();
        }

        if (!$tour) {
            return response()->json([
                'success' => false,
                'message' => 'Tour package not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $tour,
        ]);
    }

    /**
     * Store a new Tour (Agency/Admin only).
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user->isSuperAdmin() && !$user->isAgencyOwner()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized action'], 403);
        }

        $agencyId = $user->isSuperAdmin() ? $request->input('agency_id', 1) : $user->agency_id;

        $tour = Tour::create([
            'agency_id' => $agencyId,
            'destination_id' => $request->input('destination_id', 1),
            'title' => $request->input('title'),
            'slug' => Str::slug($request->input('title')) . '-' . Str::random(5),
            'category' => $request->input('category', 'Adventure'),
            'duration_days' => $request->input('duration_days', 5),
            'duration_nights' => $request->input('duration_nights', 4),
            'group_size_max' => $request->input('group_size_max', 20),
            'difficulty' => $request->input('difficulty', 'Moderate'),
            'base_price' => $request->input('base_price', 25000),
            'discount_price' => $request->input('discount_price'),
            'cover_image' => $request->input('cover_image'),
            'gallery' => $request->input('gallery', []),
            'overview' => $request->input('overview'),
            'highlights' => $request->input('highlights', []),
            'inclusions' => $request->input('inclusions', []),
            'exclusions' => $request->input('exclusions', []),
            'meeting_point' => $request->input('meeting_point', 'Islamabad Airport / I-8 Markaz'),
            'is_featured' => $request->boolean('is_featured', false),
            'status' => 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tour created successfully',
            'data' => $tour->load(['destination', 'agency']),
        ], 201);
    }
}
