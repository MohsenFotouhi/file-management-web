import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from 'inspector';
import { Observable } from 'rxjs';
import { SharedFile } from 'src/app/interface/shared-file';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  files!: SharedFile[];
  private apiUrl = environment.api + '/api/ShareFile/GetSharedByUser';

  constructor(private http: HttpClient) {

    this.files = [
      { IsPermanent : false, IsPublic : true, CreateDate : '1403/01/02' , ExpireDate : '1403/01/02' ,
        FileName :'فایل یک', VirtualPath :'', ShareWithUsers :[{  userId :'' ,username :'' }] , ShareWithEmails :[] },
        { IsPermanent : false, IsPublic : false, CreateDate : '1403/01/02' , ExpireDate : '1403/01/02' ,
          FileName :'فایل دو', VirtualPath :'', ShareWithUsers :[{  userId :'' ,username :'' }] , ShareWithEmails :[] },
        { IsPermanent : true, IsPublic : true, CreateDate : '1403/01/02' , ExpireDate : '1403/01/02' ,
          FileName :'فایل سه', VirtualPath :'', ShareWithUsers :[{  userId :'' ,username :'' }] , ShareWithEmails :[] },
        { IsPermanent : false, IsPublic : false, CreateDate : '1403/01/02' , ExpireDate : '1403/01/02' ,
          FileName :'فایل چهار', VirtualPath :'', ShareWithUsers :[{  userId :'' ,username :'' }] , ShareWithEmails :[] },
      ];

  }

  getSharedByUser(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

}
