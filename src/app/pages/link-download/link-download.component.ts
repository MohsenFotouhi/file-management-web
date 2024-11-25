import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, concatMap, finalize, map, of, tap } from 'rxjs';
import { DownloadManagerService } from 'src/app/services/download-manager.service';

enum Steps {
  EMAIL = 1,
  OTP = 2,
  READY_TO_DOWNLOAD = 3,
  UNSET = 4
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
    MatButtonModule
  ],
  templateUrl: './link-download.component.html',
  styleUrls: [
    './link-download.component.scss',
    '../auth/login/login.component.scss'
  ]
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
    private spinner: NgxSpinnerService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.linkid = this.route.snapshot.queryParamMap.get('linkid') || '';
    this.spinner.show();
    this.downloadManagerService
      .donwloadLink(this.linkid)
      .pipe(
        map((res) => {
          this.token = res.grantedToken;
          this.fileName = res.fileName;
          this.createImgSrc();
          if (res.linkDownload != null && res.linkDownload != '') {
            this.linkDownload = res.linkDownload;
            this.currentStep = this.steps.READY_TO_DOWNLOAD;
          }
          if (!res.email && res.grantedToken) {
            this.currentStep = this.steps.EMAIL;
          }
          return res;
        }),
        concatMap((res) => {
          if (res.email != null && res.email != '') {
            this.loginForm.value.username = res.email;
            // console.log('Form Submitted', this.loginForm.value);
            return this.sendOtp();
          }
          return of(res);
        }),
        catchError((err) => {
          this.router.navigate(['/error-404']);
          return of(err);
        }),
        finalize(() => {
          this.spinner.hide();
        })
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

  sendOtp() {
    this.spinner.show();
    this.currentStep = this.steps.OTP;
    return this.downloadManagerService
      .sendUserOptForToken({
        tokenId: this.token,
        usernameOrEmail: this.loginForm.value.username
      })
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      );
    // .subscribe(
    //   // (res) => {
    //   //   this.step3 = true;
    //   // }
    //   // (error) => {
    //   //   console.log('error', error);
    //   // },
    // );
  }

  createImgSrc() {
    const temp = this.fileName?.split('.')?.at(-1) || 'file';
    this.imgSrc = `assets/img/filesIcons/${temp}.png`;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.spinner.show();
      this.downloadManagerService
        .sendUserOptForToken({
          tokenId: this.token,
          usernameOrEmail: this.loginForm.value.username
        })
        .pipe(
          tap(() => {
            this.currentStep = this.steps.OTP;
          }),
          finalize(() => {
            this.spinner.hide();
          })
        )
        .subscribe
        // (res) => {
        //   this.step3 = true;
        // },
        // (error) => {
        //   console.log('error', error);
        // }
        ();
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
        })
      )
      .subscribe();
  }

  getDownloadLink(otp: string) {
    this.spinner.show();
    this.downloadManagerService
      .downloadFromLinkWith2FA({ tokenId: this.token, twoFAcode: otp })
      .pipe(
        tap((response: Blob) => {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(response);
          a.href = objectUrl;
          a.download = this.fileName;
          a.click();
          URL.revokeObjectURL(objectUrl);
        }),
        catchError(async (err) => {
          const message = await err.error.text();
          this.showErrorSnackBar(message);
          return of(err);
        }),
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(
        () => {}
        // async (error: HttpErrorResponse) => {
        //   const temp = await error.error.text();
        //   this.hasError = true;
        //   // this.router.navigate(['/error-404']);
        //   console.error('File download error:', error);
        // }
      );
  }

  showErrorSnackBar(error: string) {
    this.snackBar.open(error, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
