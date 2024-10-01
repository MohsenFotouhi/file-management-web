import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadManagerService
{

  constructor(private http: HttpClient) { }
  private API_URL = environment.api;

  // step 1
  donwloadLink(linkid: string): Observable<any>
  {
    const url = this.API_URL + '/api/DownloadManager/DownloadLink';
    return this.http.get<any>(url, { params: { linkid } });
  }

  sendUserOptForToken(dto: {tokenId: string, usernameOrEmail: string}): Observable<any>
  {
    const url = this.API_URL + '/api/DownloadManager/SendUserOtpForToken';
    return this.http.get<any>(url, { params: dto });
  }

  downloadFromLinkWith2FA(dto: { twoFAcode: string, tokenId: string; }): Observable<any>
  {
    const url = this.API_URL + '/api/DownloadManager/DownloadFromLinkWith2FA';
    return this.http.get<any>(url, { params: dto });
  }
}
