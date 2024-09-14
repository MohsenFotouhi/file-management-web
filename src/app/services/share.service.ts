import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShareModels } from '../interface/share-models';
import { environment } from 'src/environments/environment.production';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  API_URL = environment.api;

  constructor(private http: HttpClient) {
  }

  createDownloadLoi(shareModel: ShareModels): Observable<string> {
    const url = this.API_URL + '/api/DownloadManager/CreateDownloadLink'
    return this.http.post<string>(url, shareModel);
  }

}
