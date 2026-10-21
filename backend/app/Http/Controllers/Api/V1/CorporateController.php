<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CorporateAccount;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CorporateController extends Controller
{
    /**
     * List corporate accounts for tenant agency.
     */
    public function index(): JsonResponse
    {
        $accounts = CorporateAccount::withCount('invoices')->get();

        return response()->json([
            'success' => true,
            'data' => $accounts,
        ]);
    }

    /**
     * Store new corporate client account.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user->agency_id && $user->role !== 'super_admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'contact_email' => 'required|email|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'ntn_tax_id' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'credit_limit' => 'nullable|numeric|min:0',
            'discount_rate_percentage' => 'nullable|numeric|min:0|max:100',
            'requires_approval' => 'nullable|boolean',
        ]);

        $validated['agency_id'] = $user->agency_id ?? $request->input('agency_id');
        $validated['company_code'] = 'CORP-' . strtoupper(Str::random(6));
        $validated['status'] = 'active';

        $account = CorporateAccount::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Corporate account created.',
            'data' => $account,
        ], 201);
    }
}
