<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\StaffModuleAccess;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AgencyStaffController extends Controller
{
    /**
     * Get all staff for the authenticated Agency.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAgencyOwner() && !$user->isSuperAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized. Only Agency Owner can access staff.'], 403);
        }

        $agencyId = $user->agency_id;

        $staff = User::with('moduleAccess')
            ->where('agency_id', $agencyId)
            ->whereNotIn('role', ['customer', 'super_admin'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'count' => $staff->count(),
            'data' => $staff,
        ]);
    }

    /**
     * Create a new staff account under the agency workspace (Section 3.2).
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAgencyOwner() && !$user->isSuperAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        $agency = $user->agency;
        if (!$agency) {
            return response()->json(['success' => false, 'message' => 'Agency workspace not found.'], 404);
        }

        // Check staff limit if on a subscription plan
        if ($agency->subscriptionPlan) {
            $currentStaffCount = User::where('agency_id', $agency->id)
                ->whereNotIn('role', ['customer', 'super_admin', 'agency_owner'])
                ->count();
            if ($currentStaffCount >= $agency->subscriptionPlan->staff_limit) {
                return response()->json([
                    'success' => false,
                    'message' => "Staff limit ({$agency->subscriptionPlan->staff_limit}) reached for your plan. Please upgrade your plan."
                ], 422);
            }
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:30',
            'role' => 'required|in:operational_manager,sales_agent,accountant,driver',
            'password' => 'required|string|min:6',
            'designation' => 'nullable|string|max:100',
            'cnic_passport' => 'nullable|string|max:50',
            'modules' => 'nullable|array', // Custom module permissions array
        ]);

        $newStaff = User::create([
            'agency_id' => $agency->id,
            'name' => $validated['name'],
            'email' => strtolower($validated['email']),
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'],
            'designation' => $validated['designation'] ?? ucfirst(str_replace('_', ' ', $validated['role'])),
            'cnic_passport' => $validated['cnic_passport'] ?? null,
            'password' => Hash::make($validated['password']),
            'is_active' => true,
            'profile_completed' => false, // Section 3.6: must complete profile on login
            'avatar' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        ]);

        // Default or Custom Module Assignment (Section 3.2)
        $defaultModules = ['packages', 'hotel', 'flight', 'car_rental', 'corporate'];
        $modulesInput = $request->input('modules', []);

        foreach ($defaultModules as $mod) {
            $modConfig = $modulesInput[$mod] ?? null;

            StaffModuleAccess::create([
                'staff_id' => $newStaff->id,
                'agency_id' => $agency->id,
                'module' => $mod,
                'permission_level' => $modConfig['permission_level'] ?? ($newStaff->isOperationalManager() ? 'full_access' : 'view_only'),
                'can_view' => $modConfig['can_view'] ?? true,
                'can_add_edit' => $modConfig['can_add_edit'] ?? ($newStaff->isOperationalManager()),
                'can_book' => $modConfig['can_book'] ?? in_array($newStaff->role, ['operational_manager', 'sales_agent']),
                'can_approve_refund' => $modConfig['can_approve_refund'] ?? in_array($newStaff->role, ['operational_manager', 'accountant']),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => "Staff member '{$newStaff->name}' created successfully.",
            'data' => $newStaff->load('moduleAccess'),
        ], 201);
    }

    /**
     * Update custom module permissions for a staff member (Section 3.2).
     */
    public function updatePermissions(Request $request, int $staffId): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAgencyOwner() && !$user->isSuperAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        $staff = User::where('agency_id', $user->agency_id)->findOrFail($staffId);

        $validated = $request->validate([
            'modules' => 'required|array',
            'modules.*.module' => 'required|in:packages,hotel,flight,car_rental,corporate',
            'modules.*.can_view' => 'required|boolean',
            'modules.*.can_add_edit' => 'required|boolean',
            'modules.*.can_book' => 'required|boolean',
            'modules.*.can_approve_refund' => 'required|boolean',
        ]);

        foreach ($validated['modules'] as $modData) {
            StaffModuleAccess::updateOrCreate(
                [
                    'staff_id' => $staff->id,
                    'module' => $modData['module'],
                ],
                [
                    'agency_id' => $staff->agency_id,
                    'can_view' => $modData['can_view'],
                    'can_add_edit' => $modData['can_add_edit'],
                    'can_book' => $modData['can_book'],
                    'can_approve_refund' => $modData['can_approve_refund'],
                    'permission_level' => $modData['can_add_edit'] ? 'add_edit' : ($modData['can_book'] ? 'book_only' : 'view_only'),
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => "Permissions for {$staff->name} updated successfully.",
            'data' => $staff->load('moduleAccess'),
        ]);
    }

    /**
     * Toggle Staff Active Status.
     */
    public function toggleStatus(Request $request, int $staffId): JsonResponse
    {
        $user = $request->user();
        if (!$user->isAgencyOwner() && !$user->isSuperAdmin()) {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        $staff = User::where('agency_id', $user->agency_id)->findOrFail($staffId);
        $staff->is_active = !$staff->is_active;
        $staff->save();

        return response()->json([
            'success' => true,
            'message' => "Staff member {$staff->name} is now " . ($staff->is_active ? 'Active' : 'Deactivated') . ".",
            'data' => $staff,
        ]);
    }
}
