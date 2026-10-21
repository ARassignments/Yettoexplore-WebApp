import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = typeof window !== 'undefined' ? localStorage.getItem('yte_auth_token') : null;

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  } else {
    authReq = req.clone({
      setHeaders: {
        Accept: 'application/json',
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('yte_auth_token');
          localStorage.removeItem('yte_user');
        }
        // Redirect to login if unauthorized
        router.navigate(['/auth'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => error);
    })
  );
};
