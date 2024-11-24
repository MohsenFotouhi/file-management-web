import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, take, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) { }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const snackBar = inject(MatSnackBar);
    const token = this.authService.getAuthToken();

    if (!req.url.includes('Auth/login')) {
      // if (!token) {
      //   this.authService.logout();
      //   return throwError(() => new HttpErrorResponse({ status: 401 }));
      // } else {
      // }
      req = this.addToken(req, token);
    }

    return next.handle(req).pipe(
      tap(event => {
        // console.log(event);
      }),
      catchError((error: HttpErrorResponse) => {
        if ([401].includes(error.status)) {
          return this.handle401Error(req, next).pipe(catchError(err => {
            // Optionally handle error from handle401Error  
            return throwError(() => err); // Propagate the error  
          }));
        } else {
          this.handle400Error(snackBar, error);
          return throwError(() => error); // Return the original error  
        }
      })
    );
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.tokenSubject.next(null); // Notify subscribers to wait for the token  

      return this.authService.refreshToken().pipe(
        switchMap((newToken) => {
          if (newToken?.token) {
            this.tokenSubject.next(newToken.token);
            return next.handle(this.addToken(req, newToken.token));
          }

          this.authService.logout();
          return throwError(() => new HttpErrorResponse({ status: 401 })); // Propagated error  
        }),
        catchError(error => {
          this.authService.logout();
          return throwError(() => error); // Propagate refresh token error  
        }),
        finalize(() => this.isRefreshingToken = false)
      );
    } else {
      // Wait for other requests to complete the token refresh  
      return this.tokenSubject.pipe(
        filter(token => token != null), // Wait until the token is set  
        take(1),
        switchMap(token => next.handle(this.addToken(req, token!)))
      );
    }
  }


  private handle400Error(snackBar: MatSnackBar, error: HttpErrorResponse) {
    snackBar.open(error.error, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}