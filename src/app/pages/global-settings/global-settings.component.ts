import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, tap } from 'rxjs';

import { SettingsRecycleBinComponent } from '../settings/recycle-bin/recycle-bin.component';
import { GlobalSettingsStorageComponent } from './storage/storage.component';
import { GlobalSettingsDownloadComponenet } from './download/download.component';
import { GlobalSettingsUploadComponenet } from './upload/upload.component';
import { GlobalSettingsLDAPComponent } from './ldap/ldap.component';
import { GlobalSettingsEmailComponent } from './email/email.component';
import { Setting } from 'src/app/interface/setting-model';
import { SettingService } from 'src/app/services/setting.service';

enum GlobalSettingsTabs {
  GeneralGlobalSetting = 'GeneralGlobalSetting',
  RecycleBinGlobalSetting = 'RecycleBinGlobalSetting',
  EmailGlobalSetting = 'EmailGlobalSetting',
  LDAPSetting = 'LDAPSetting',
  DownloadGlobalSetting = 'DownloadGlobalSetting',
  UploadGlobalSetting = 'UploadGlobalSetting'
}

@Component({
  selector: 'global-settings',
  templateUrl: './global-settings.component.html',
  styleUrl: './global-settings.component.scss',
  standalone: true,
  imports: [
    VexPageLayoutComponent,
    VexPageLayoutHeaderDirective,
    VexPageLayoutContentDirective,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    SettingsRecycleBinComponent,
    GlobalSettingsStorageComponent,
    GlobalSettingsDownloadComponenet,
    GlobalSettingsUploadComponenet,
    GlobalSettingsLDAPComponent,
    GlobalSettingsEmailComponent
    // AsyncPipe,
    // NgIf
  ]
})
export class GlobalSettingsComponent implements OnInit {
  tabs = GlobalSettingsTabs;
  apiModel: Setting;
  settingsData: any = {};

  constructor(
    private settingService: SettingService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getSettings();
  }

  getSettings() {
    this.spinner.show();
    this.settingService
      .getSetting()
      .pipe(
        tap((res) => {
          res.forEach((item) => {
            this.settingsData[item.Key] = item.Value;
          });
        }),
        tap(() => console.log(this.settingsData)),
        finalize(() => this.spinner.hide())
      )
      .subscribe();
  }

  handleSubmit(value: Object, key: string) {
    this.apiModel = {
      configs: [
        {
          key,
          value: JSON.stringify(value)
        }
      ]
    };
    this.spinner.show();
    this.settingService
      .saveSetting(this.apiModel)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe();
  }
}
