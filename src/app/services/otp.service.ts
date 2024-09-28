import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpService
{
  API_URL = environment.api;
  constructor(private http: HttpClient) { }

  getOtpConfig(): Observable<{ totpConfig: string; }>
  {
    const url = this.API_URL + '/api/Auth/GetOtpConfig';
    return this.http.get<{ totpConfig: string; }>(url);
  }

}
