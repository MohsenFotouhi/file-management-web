import { Injectable } from '@angular/core';
import {  Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams,  } from '@angular/common/http';
import {environment} from "../../environments/environment";
import { CreateDownloadLinkCommand } from '../interface/share-models';


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

  // getSharedFiles(): Observable<any> {
  //   var files = [
  //     { CreateDate : '' , FileName: "text1.txt" , FileSize : "10kb" , ModifiedDate :'' , VirtualPath :''},
  //     { CreateDate : '' , FileName: "text2.txt" , FileSize : "10kb" , ModifiedDate :'' , VirtualPath :''},
  //     { CreateDate : '' , FileName: "text3.txt" , FileSize : "10kb" , ModifiedDate :'' , VirtualPath :''},
  //     { CreateDate : '' , FileName: "text4.txt" , FileSize : "10kb" , ModifiedDate :'' , VirtualPath :''},
  //     { CreateDate : '' , FileName: "text5.txt" , FileSize : "10kb" , ModifiedDate :'' , VirtualPath :''}
  //   ];

  //   return of(files);
  // }

  getSharedFiles(): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('id', this.id);
    formData.append('command', "getSharedFiles");
    formData.append('parameters', '');

    const url = `${this.apiUrl}HgoApi1`;
    return this.http.post<any>(url, formData);
  }



}
