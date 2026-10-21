import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const userAreaGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  if (typeof window === 'undefined') {
    return true;
  }

  const token = localStorage.getItem('yte_auth_token');
  const userStr = localStorage.getItem('yte_user');

  if (!token || !userStr) {
    // Visitor / Guest is allowed to view public website
    return true;
  }

  try {
    const user = JSON.parse(userStr);
    const nonTravelerRoles = [
      'super_admin',
      'agency_owner',
      'agency_agent',
      'tour_guide',
      'tour_manager',
      'reservation_agent',
      'agency_accountant',
      'customer_support'
    ];

    // If an administrative/agency role is logged in:
    // They are restricted to the dashboard and cannot visit public website screens unless they are a customer (traveler).
    if (user && user.role && nonTravelerRoles.includes(user.role)) {
      // Allow /auth page only if explicitly switching or logging out
      if (state.url.startsWith('/auth')) {
        return true;
      }
      return router.createUrlTree(['/dashboard']);
    }
  } catch (e) {
    console.error('User area guard error', e);
  }

  return true;
};
