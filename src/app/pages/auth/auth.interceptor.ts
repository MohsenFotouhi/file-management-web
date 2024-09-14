import {HttpInterceptorFn, HttpRequest} from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (token) req = setToken(req, token);
  return next(req);
};

export const setToken = (req: HttpRequest<any>, token: string) => {
  return req.clone({headers: req.headers.set('Authorization', `Bearer ${token}`)});
} // set token in header

export const setHeader = (req: HttpRequest<any>) => {
  return req.clone({headers: req.headers.set('Content-Type', `application/json`)});
} // set headers
