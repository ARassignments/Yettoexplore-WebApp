import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = typeof window !== 'undefined' ? localStorage.getItem('yte_auth_token') : null;

  if (token) {
    return true;
  }

  // Not logged in -> redirect to login with returnUrl
  return router.createUrlTree(['/contact'], {
    queryParams: { returnUrl: state.url },
  });
};
