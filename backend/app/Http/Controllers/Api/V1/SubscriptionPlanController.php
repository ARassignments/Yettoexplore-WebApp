<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubscriptionPlanController extends Controller
{
    /**
     * Get all active subscription plans (Public for discovery / Super Admin for management).
     */
    public function index(): JsonResponse
    {
        $plans = SubscriptionPlan::where('is_active', true)->get();

        return response()->json([
            'success' => true,
            'data' => $plans,
        ]);
    }

    /**
     * Store new subscription plan (Super Admin only).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'billing_cycle' => 'required|in:monthly,yearly',
            'modules_included' => 'required|array',
            'staff_limit' => 'required|integer|min:1',
            'commission_rate' => 'required|numeric|min:0|max:100',
            'description' => 'nullable|string',
        ]);

        $plan = SubscriptionPlan::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . Str::random(4),
            'price' => $validated['price'],
            'currency' => $validated['currency'] ?? 'MYR',
            'billing_cycle' => $validated['billing_cycle'],
            'modules_included' => $validated['modules_included'],
            'staff_limit' => $validated['staff_limit'],
            'commission_rate' => $validated['commission_rate'],
            'description' => $validated['description'] ?? null,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Subscription plan created successfully',
            'data' => $plan,
        ], 201);
    }

    /**
     * Update subscription plan (Super Admin only).
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $plan = SubscriptionPlan::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'price' => 'sometimes|numeric|min:0',
            'billing_cycle' => 'sometimes|in:monthly,yearly',
            'modules_included' => 'sometimes|array',
            'staff_limit' => 'sometimes|integer|min:1',
            'commission_rate' => 'sometimes|numeric|min:0|max:100',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $plan->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Subscription plan updated successfully',
            'data' => $plan,
        ]);
    }
}
