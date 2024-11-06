import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) =>
{
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);  // Inject MatSnackBar
  const token = localStorage.getItem('token');

  if (token) req = setToken(req, token);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) =>
    {
      if ([401].includes(error.status))
      {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }
      else
      {
        snackBar.open(error.error, 'Close', {
          duration: 3000, // Duration in milliseconds
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
      return throwError(error);
    })
  );
};

export const setToken = (req: HttpRequest<any>, token: string) =>
{
  return req.clone({ headers: req.headers.set('Authorization', `Bearer ${ token }`) });
}; // set token in header

export const setHeader = (req: HttpRequest<any>) =>
{
  return req.clone({ headers: req.headers.set('Content-Type', `application/json`) });
}; // set headers
