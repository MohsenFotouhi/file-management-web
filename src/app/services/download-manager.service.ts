import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, from, lastValueFrom, mergeMap, Observable, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IndexDBHelperService } from './index-db-helper.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadManagerService {

  constructor(private http: HttpClient) {
  }

  private API_URL = environment.api;

  // step 1
  donwloadLink(linkid: string): Observable<any> {
    const url = this.API_URL + '/api/DownloadManager/DownloadLink';
    return this.http.get<any>(url, { params: { linkid } });
  }

  sendUserOptForToken(dto: { tokenId: string, usernameOrEmail: string }): Observable<any> {
    const url = this.API_URL + '/api/DownloadManager/SendUserOtpForToken';
    return this.http.get<any>(url, { params: dto });
  }

  downloadFromLinkWith2FA(dto: { twoFAcode: string, tokenId: string; }): Observable<any> {
    const url = this.API_URL + '/api/DownloadManager/DownloadFromLinkWith2FA';
    return this.http.get(url, { params: dto, responseType: 'blob' });
  }


  downloadFileAsync(command: string, parameters: string): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('fileID', parameters);

    const url = `${this.API_URL}/api/DownloadFile/DownloadFilebyIdAsync`;
    console.log(url);
    return this.http.post(url, formData, { responseType: 'blob' });
  }

  downloadChunk(fileUrl: string, start: number, end: number): Observable<Blob> {
    const headers = new HttpHeaders({ Range: `bytes=${start}-${end}` });
    return this.http.get(fileUrl, { headers, responseType: 'blob' }).pipe(
      retry(2), // تلاش مجدد تا 2 بار
      catchError((error) => throwError(() => error))
    );
  }
}
