<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    /**
     * List invoices for tenant agency.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Invoice::with(['user', 'corporateAccount', 'booking']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $invoices = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $invoices->items(),
            'meta' => [
                'current_page' => $invoices->currentPage(),
                'total' => $invoices->total(),
            ],
        ]);
    }

    /**
     * Store new manual invoice.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user->agency_id && $user->role !== 'super_admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtotal' => 'required|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'due_date' => 'required|date',
            'user_id' => 'nullable|exists:users,id',
            'corporate_account_id' => 'nullable|exists:corporate_accounts,id',
            'booking_id' => 'nullable|exists:bookings,id',
            'notes' => 'nullable|string',
        ]);

        $subtotal = $validated['subtotal'];
        $tax = $validated['tax_amount'] ?? 0;
        $discount = $validated['discount_amount'] ?? 0;
        $validated['total_amount'] = max(0, $subtotal + $tax - $discount);
        $validated['agency_id'] = $user->agency_id ?? $request->input('agency_id');
        $validated['invoice_number'] = 'INV-' . Carbon::now()->format('Y') . '-' . strtoupper(Str::random(6));
        $validated['status'] = 'unpaid';

        $invoice = Invoice::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Invoice generated successfully.',
            'data' => $invoice,
        ], 201);
    }

    /**
     * Mark invoice as paid.
     */
    public function markAsPaid(Request $request, int $id): JsonResponse
    {
        $invoice = Invoice::findOrFail($id);

        $validated = $request->validate([
            'payment_method' => 'required|string',
        ]);

        $invoice->update([
            'status' => 'paid',
            'payment_method' => $validated['payment_method'],
            'paid_at' => Carbon::now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Invoice marked as paid.',
            'data' => $invoice,
        ]);
    }
}
