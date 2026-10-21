import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../models/user.model';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('yte_user') : null;

    if (!userStr) {
      return router.createUrlTree(['/contact'], {
        queryParams: { returnUrl: state.url },
      });
    }

    try {
      const user = JSON.parse(userStr);
      if (allowedRoles.includes(user.role)) {
        return true;
      }
    } catch (e) {
      console.error('Failed to parse user role', e);
    }

    // Role unauthorized -> redirect to home
    return router.createUrlTree(['/']);
  };
};
