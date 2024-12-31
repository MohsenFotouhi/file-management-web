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
      { isPermanent : false, isPublic : true, createDate : '1403/01/02' , expireDate : '1403/01/02' ,
        fileName :'فایل یک', virtualPath :'', shareWithUsers :[{  userId :'' ,username :'' }] , shareWithEmails :[] },
        { isPermanent : false, isPublic : false, createDate : '1403/01/02' , expireDate : '1403/01/02' ,
          fileName :'فایل دو', virtualPath :'', shareWithUsers :[{  userId :'' ,username :'' }] , shareWithEmails :[] },
        { isPermanent : true, isPublic : true, createDate : '1403/01/02' , expireDate : '1403/01/02' ,
          fileName :'فایل سه', virtualPath :'', shareWithUsers :[{  userId :'' ,username :'' }] , shareWithEmails :[] },
        { isPermanent : false, isPublic : false, createDate : '1403/01/02' , expireDate : '1403/01/02' ,
          fileName :'فایل چهار', virtualPath :'', shareWithUsers :[{  userId :'' ,username :'' }] , shareWithEmails :[] },
      ];

  }

  getSharedByUser(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

}
