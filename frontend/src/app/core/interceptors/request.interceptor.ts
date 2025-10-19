import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const RequestInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/signup')
  ) {
    return next(req);
  }

  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.clear();

        router.navigate(['/auth/login']);

        console.warn('Session expired or invalid token. Redirecting to login...');
      }

      return throwError(() => error);
    })
  );
};
