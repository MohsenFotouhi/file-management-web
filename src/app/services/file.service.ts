import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  API_URL = environment.api;
  id: string = 'HgoApi1';

  constructor(private http: HttpClient) {
  }

  getFolderContent(parameters = ''): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('id', this.id);
    formData.append('command', 'getFolderContent');
    formData.append('parameters', parameters);
    const url = this.API_URL + '/HgoApi1';
    return this.http.post<any>(url, formData);
  }

}
