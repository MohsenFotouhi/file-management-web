import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { SettingsRecycleBinComponent } from '../settings/recycle-bin/recycle-bin.component';
import { GlobalSettingsStorageComponent } from './storage/storage.component';
import { GlobalSettingsDownloadComponenet } from './download/download.component';
import { GlobalSettingsUploadComponenet } from './upload/upload.component';
import { GlobalSettingsLDAPComponent } from './ldap/ldap.component';
import { GlobalSettingsEmailComponent } from './email/email.component';

enum GlobalSettingsTabs {
  GeneralGlobalSetting = 'ذخیره سازی',
  RecycleBinGlobalSetting = 'سطل زباله',
  EmailGlobalSetting = 'ایمیل',
  LDAPSetting = 'LDAPSetting',
  DownloadGlobalSetting = 'دانلود',
  UploadGlobalSetting = 'آپلود'
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
    GlobalSettingsEmailComponent,
    // AsyncPipe,
    // NgIf
  ]
})
export class GlobalSettingsComponent {
  tabs = GlobalSettingsTabs;
}
