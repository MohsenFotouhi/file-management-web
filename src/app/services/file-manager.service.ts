import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FileSystemCommand } from '../interface/file-system-command';
import { FileDownloadService } from './file-download.service';
import { UserStorageUse } from '../interface/share-models';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {
  progress = 0;

  constructor(
    private http: HttpClient,
    private fileDownloadService: FileDownloadService
  ) {
    this.fileDownloadService.progress$.subscribe((value) => {
      this.progress = value;
    });
  }

  private apiUrl = environment.api + '/';
  id: string = 'RayanFileManagerApi1';

  CallAPI(command: string, parameters: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('id', this.id);
    formData.append('command', command);
    formData.append('parameters', parameters);

    const url = `${this.apiUrl}RayanFileManagerApi1`;
    return this.http.post<any>(url, formData);
  }

  uploadFileChunk(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}RayanFileManagerApi1`, formData, {
      headers: new HttpHeaders({ enctype: 'multipart/form-data' })
    });
  }

  preview(command: string, parameters: string): Observable<any> {
    let formData = new HttpParams();
    formData = formData.set('id', this.id);
    formData = formData.set('command', command);
    formData = formData.set('parameters', parameters);

    const url = `${this.apiUrl}RayanFileManagerApi2`;
    return this.http.get(url, { params: formData, responseType: 'blob' });
  }

  uploadFile(command: string, parameters: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('id', this.id);
    formData.append('command', command);
    formData.append('parameters', parameters);
    formData.append('file', file, file.name);

    const url = `${this.apiUrl}RayanFileManagerApi1`;
    return this.http.post<any>(url, formData);
  }

  uploadFileEncrypt(
    currentPath: string,
    file: File,
    index: number,
    totalCount: number,
    fileSize: number
  ): Observable<any> {
    const destinationPathInfo = [{ key: currentPath, name: currentPath }];
    const chunkMetadata = {
      UploadId: '2feabfc4-9473-7c29-fc56-4deac56c3f84',
      FileName: file.name,
      Index: index,
      TotalCount: totalCount,
      FileSize: fileSize
    };
    const argumentsData = JSON.stringify({
      destinationPathInfo: destinationPathInfo,
      chunkMetadata: chunkMetadata
    });

    const formData = new FormData();
    formData.append('chunk', file);
    formData.append('arguments', argumentsData);
    formData.append('command', 'UploadChunk');

    const url = `${this.apiUrl}RayanFileManagerApi1`;
    // const url = `http://localhost:13153/api/file-manager-file-system-images`;
    return this.http.post<any>(url, formData);
  }

  downloadFileDecrypt(currentPath: string, fileName: string): Observable<any> {
    const pathInfoList = [
      [{ key: currentPath, name: currentPath }],
      [{ key: currentPath + '\\' + fileName, name: fileName }]
    ];

    const payload = {
      pathInfoList,
      command: FileSystemCommand.Download
    };

    const url = `http://localhost:13153/api/file-manager-file-system-images`;
    return this.http.post<any>(url, payload);
  }

  downloadFile(command: string, parameters: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('id', this.id);
    formData.append('command', command);
    formData.append('parameters', parameters);

    const url = `${this.apiUrl}RayanFileManagerApi1`;
    return this.http.post(url, formData, { responseType: 'blob' });
  }
  downloadFileAsync(command: string, parameters: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('id', this.id);
    formData.append('command', command);
    formData.append('parameters', parameters);

    const url = `${this.apiUrl}api/DownloadFile/DownloadFileAsync`;
    return this.http.post(url, formData, { responseType: 'blob' });
  }

  async downloadFileWithRange(fileId: string, totalSize: number) {
    const url =
      `${this.apiUrl}api/DownloadFile/download-with-range?fileID=` + fileId;

    await this.fileDownloadService.downloadFile(url, totalSize);
  }

  downloadShareFiles(downloadId: string, VirtualPath: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('downloadId', downloadId);
    formData.append('virtualPath', VirtualPath);

    const url = `${this.apiUrl}api/ShareFile/DownloadShareFiles`;
    return this.http.post(url, formData, { responseType: 'blob' });
  }

  pasteFile(actionName: string, data: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('id', this.id);
    formData.append('command', actionName);
    formData.append('parameters', data);

    const url = `${this.apiUrl}RayanFileManagerApi1`;
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
    formData.append('command', 'getSharedFiles');
    formData.append('parameters', '');

    const url = `${this.apiUrl}RayanFileManagerApi1`;
    return this.http.post<any>(url, formData);
  }

  getUserStorageUse() {
    const url = `${this.apiUrl}GetUserStorageUse`;
    return this.http.get<UserStorageUse>(url);
  }
}
