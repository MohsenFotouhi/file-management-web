import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {LoginModel, LoginResponse, User} from 'src/app/interface/auth-interface';
import {environment} from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  API_URL = environment.api;
  user!: User;

  headers = {'Content-Type': `application/json`};

  constructor(private http: HttpClient) {
    this.setUser();
  }

  setUser(): void {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) this.user = JSON.parse(userInfo);
  }

  login(obj: LoginModel): Observable<LoginResponse> {
    const url = this.API_URL + 'api/Auth/login'
    return this.http.post<LoginResponse>(url, obj, {headers : this.headers});
  }
}
