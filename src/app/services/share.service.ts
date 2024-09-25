import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.production';
import { CreateDownloadLinkCommand } from '../interface/share-models';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  API_URL = environment.api;

  constructor(private http: HttpClient) {
  }

  createDownloadLink(command: CreateDownloadLinkCommand): Observable<any> {
    const url = this.API_URL + '/api/DownloadManager/CreateDownloadLink'
   return this.http.post<any>(url, command);
  }

}
