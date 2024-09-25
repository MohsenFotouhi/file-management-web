import {HttpErrorResponse, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) req = setToken(req, token);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.removeItem('token');
        const router = inject(Router); 
        router.navigate(['/login']); 
      }
      return throwError(error);
    })
  );
};

export const setToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({headers: req.headers.set('Authorization', `Bearer ${token}`)});
} // set token in header

export const setHeader = (req: HttpRequest<any>) => {
  return req.clone({headers: req.headers.set('Content-Type', `application/json`)});
} // set headers
