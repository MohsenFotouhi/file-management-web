import { AuthService } from './../auth/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';
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
import { SettingsStorageComponent } from './storage/storage.component';
import { SettingsRecycleBinComponent } from './recycle-bin/recycle-bin.component';
import {
  CreateUserSetting,
  RecycleBin
} from 'src/app/interface/auth-interface';
import { finalize, map, Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'vex-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
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
    SettingsStorageComponent,
    SettingsRecycleBinComponent,
    AsyncPipe,
    NgIf
  ]
})
export class SettingsComponent implements OnInit {
  visible = false;
  settingsModel: CreateUserSetting = {};
  settingsData$: Observable<CreateUserSetting>;

  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {
    this.settingsModel.groupId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  }

  ngOnInit(): void {
    this.spinner.show();
    this.settingsData$ = this.authService.getAllUserSetting().pipe(
      map((res) => {
        this.settingsModel = res[0] || {};
        return this.settingsModel;
      }),
      finalize(() => {
        this.spinner.hide();
      })
    );
  }

  onStorageSubmit(storage: Storage) {
    this.settingsModel.storageSetting = JSON.stringify(storage);
    this.createOrUpdateUserSetting();
  }

  onRecycleBinSubmit(recycleBin: RecycleBin) {
    this.settingsModel.recycleBinSetting = JSON.stringify(recycleBin);
    this.createOrUpdateUserSetting();
  }

  createOrUpdateUserSetting() {
    this.spinner.show();
    if (this.settingsModel.id) {
      this.authService
        .updateUserSetting(this.settingsModel)
        .pipe(finalize(() => this.spinner.hide()))
        .subscribe();
    } else {
      this.authService
        .createUserSetting(this.settingsModel)
        .pipe(finalize(() => this.spinner.hide()))
        .subscribe();
    }
  }
}
