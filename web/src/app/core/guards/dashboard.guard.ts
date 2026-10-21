import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const dashboardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window === 'undefined') {
    return true;
  }

  const token = localStorage.getItem('yte_auth_token');

  if (!token) {
    // Unauthenticated user -> redirect to auth
    return router.createUrlTree(['/auth'], {
      queryParams: { returnUrl: state.url }
    });
  }

  return true;
};
