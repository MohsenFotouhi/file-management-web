import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { LoginModel, LoginResponse, User } from 'src/app/interface/auth-interface';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  API_URL = environment.api;
  user!: User;
  user$ = new BehaviorSubject<User | null>(null);
  headers = { 'Content-Type': `application/json` };

  constructor(private http: HttpClient, private router: Router)
  {
    this.setUser();
  }

  setUser(): void
  {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo)
    {
      this.user = JSON.parse(userInfo);
      this.user$.next(this.user);
    }
  }

  login(obj: LoginModel): Observable<LoginResponse>
  {
    const url = this.API_URL + '/api/Auth/login';
    return this.http.post<LoginResponse>(url, obj, { headers: this.headers }).pipe(map(res =>
    {
      localStorage.setItem('token', res.token);
      localStorage.setItem('refreshToken', res.refreshToken);
      localStorage.setItem('userInfo', JSON.stringify(res.userInfo));
      localStorage.setItem('username', res.userInfo.username);
      localStorage.setItem('userGUID', res.userInfo.userGUID);
      return res;
    }));
  }

  refreshToken(): Observable<LoginResponse>
  {
    const url = this.API_URL + '/api/Auth/refreshToken';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${ this.getAuthToken() }`,  // Include the token  
      'Content-Type': 'application/json',  // Set content type if needed  
    });

    return this.http.post<LoginResponse>(url, { refreshToken: this.getRefreshToken() }, { headers });
  }

  getAuthToken(): string
  {
    return localStorage.getItem('token') ?? '';
  }

  getRefreshToken(): string
  {
    return localStorage.getItem('refreshToken') ?? '';
  }

  logout()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('username');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userGUID');
    this.router.navigate(['/login']);
  }

}
