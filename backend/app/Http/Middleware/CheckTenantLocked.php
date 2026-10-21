<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTenantLocked
{
    /**
     * Handle an incoming request.
     * Check if the tenant trial has expired and is locked.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Platform Super Admins & individual Customers are exempt from agency tenant lock
        if (!$user || $user->isSuperAdmin() || $user->isCustomer()) {
            return $next($request);
        }

        $agency = $user->agency;
        if ($agency) {
            // Check if agency is locked or trial is expired
            if ($agency->isTrialExpired() && !$agency->is_permanently_free) {
                // If staff (non-owner), access is blocked
                if (!$user->isAgencyOwner()) {
                    return response()->json([
                        'success' => false,
                        'code' => 'TENANT_LOCKED',
                        'message' => 'Agency workspace is locked because the free trial has expired. Please contact your agency administrator.',
                    ], 403);
                }

                // If owner, allow billing/subscription endpoints, but lock operational writes
                if (!$request->is('api/v1/agency/subscription*') && !$request->is('api/v1/auth/me') && !$request->is('api/v1/auth/logout')) {
                    return response()->json([
                        'success' => false,
                        'code' => 'TRIAL_EXPIRED',
                        'message' => 'Your free trial has expired. Please subscribe to a plan to unlock full workspace access.',
                        'trial_status' => 'expired',
                        'trial_remaining' => $agency->trialRemaining(),
                    ], 402); // 402 Payment Required
                }
            }
        }

        return $next($request);
    }
}
