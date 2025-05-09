import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Setting } from '../interface/setting-model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  API_URL = environment.api + '/api/Setting/';

  constructor(private http: HttpClient) {}

  getSetting() {
    return this.http.get(this.API_URL + 'GetSetting').pipe(
      map((res: any) => {
        return res.Result.Configs as { Key: string; Value: string }[];
      })
    );
  }

  saveSetting(data: Setting) {
    return this.http.post(this.API_URL + 'SaveSetting', data);
  }
}
