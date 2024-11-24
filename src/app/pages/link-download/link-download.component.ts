import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { DownloadManagerService } from 'src/app/services/download-manager.service';

enum Steps {
  STEP_1 = 1,
  STEP_2 = 2,
  READY_TO_DOWNLOAD = 3,
  UNSET = 4,
}

@Component({
  selector: 'vex-link-download',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './link-download.component.html',
  styleUrls: [
    './link-download.component.scss',
    '../auth/login/login.component.scss',
  ],
})
export class LinkDownloadComponent implements OnInit {
  hasError = false;
  loginForm: FormGroup;
  linkid: string = '';
  token: string = '';
  step3: boolean = false;
  fileName: string = '';
  otp: string = '';
  linkDownload: string = '';
  steps = Steps;
  currentStep: number = this.steps.UNSET;
  imgSrc: string = '';
  constructor(
    private downloadManagerService: DownloadManagerService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('download page');
    this.linkid = this.route.snapshot.queryParamMap.get('linkid') || '';
    this.downloadManagerService
      .donwloadLink(this.linkid)
      .pipe(
        map((res) => {
          console.log('res', res);
          this.token = res.grantedToken;
          this.fileName = res.fileName;
          if (res.linkDownload != null && res.linkDownload != '') {
            this.linkDownload = res.linkDownload;
            this.currentStep = this.steps.READY_TO_DOWNLOAD;
            this.createImgSrc();
          } else if (res.email != null && res.email != '') {
            this.loginForm.value.username = res.email;
            this.downloadManagerService
              .sendUserOptForToken({
                tokenId: this.token,
                usernameOrEmail: this.loginForm.value.username,
              })
              .subscribe(
                (res) => {
                  this.step3 = true;
                },
                // (error) => {
                //   console.log('error', error);
                // },
              );
            console.log('Form Submitted', this.loginForm.value);
          }
        }),
      )
      .subscribe
      // (res) => {

      // },
      // (error) => {
      //   this.hasError = true;
      //   console.log('error', error);
      // },
      ();
  }

  createImgSrc() {
    const temp = this.fileName.split('.').at(-1) || 'file';
    this.imgSrc = `assets/img/filesIcons/${temp}.png`;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.downloadManagerService
        .sendUserOptForToken({
          tokenId: this.token,
          usernameOrEmail: this.loginForm.value.username,
        })
        .subscribe(
          (res) => {
            this.step3 = true;
          },
          (error) => {
            console.log('error', error);
          },
        );
      console.log('Form Submitted', this.loginForm.value);
    }
  }

  downloadFile() {
    this.downloadManagerService
      .downloadFileAsync('download', this.linkDownload)
      .pipe(
        tap((response: Blob) => {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(response);
          a.href = objectUrl;
          a.download = this.fileName;
          a.click();
          URL.revokeObjectURL(objectUrl);
          a.remove();
        }),
        catchError((err) => {
          console.error('File download error:', err);
          return of(err);
        }),
      )
      .subscribe();
  }

  getDownloadLink(otp: string) {
    this.downloadManagerService
      .downloadFromLinkWith2FA({ tokenId: this.token, twoFAcode: otp })
      .subscribe(
        (response: Blob) => {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(response);
          a.href = objectUrl;
          a.download = this.fileName;
          a.click();
          URL.revokeObjectURL(objectUrl);
        },
        (error) => {
          this.hasError = true;
          console.error('File download error:', error);
        },
      );
  }
}
