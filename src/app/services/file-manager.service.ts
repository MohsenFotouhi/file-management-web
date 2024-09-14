import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams,  } from '@angular/common/http';
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.api + '/';
  id: string = 'HgoApi1';


  CallAPI(command: string, parameters: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('id', this.id);
    formData.append('command', command);
    formData.append('parameters', parameters);

    const url = `${this.apiUrl}HgoApi1`;
    return this.http.post<any>(url, formData);
  }


  private logiURl = environment.api + '/api/Auth/login';
  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post(this.logiURl, loginData);
  }

  uploadFileChunk(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}HgoApi1`, formData, {
      headers: new HttpHeaders({ 'enctype': 'multipart/form-data' })
    });
  }


  downloadFile(command: string, parameters: string): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('id', this.id);
    formData.append('command', command);
    formData.append('parameters', parameters);

    const url = `${this.apiUrl}HgoApi1`;
    return this.http.post(url, formData, { responseType: 'blob' });
  }



  preview(command: string, parameters: string): Observable<any> {

    let formData = new HttpParams();
    formData = formData.set('id', this.id);
    formData = formData.set('command', command);
    formData = formData.set('parameters', parameters);

    const url = `${this.apiUrl}HgoApi2`;
  return this.http.get(url, { params: formData ,responseType: 'blob' });
  }

  uploadFile(command: string, parameters: string, file: File): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('id', this.id);
    formData.append('command', command);
    formData.append('parameters', parameters);
    formData.append('file', file, file.name);

    const url = `${this.apiUrl}HgoApi1`;
    return this.http.post<any>(url, formData);
  }


  pasteFile(actionName: string, data: string): Observable<any> {

    const formData: FormData = new FormData();
    formData.append('id', this.id);
    formData.append('command', actionName);
    formData.append('parameters', data);

    const url = `${this.apiUrl}HgoApi1`;
    return this.http.post<any>(url, formData);

  }

}
