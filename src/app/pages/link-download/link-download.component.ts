import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { DownloadManagerService } from 'src/app/services/download-manager.service';

@Component({
  selector: 'vex-link-download',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './link-download.component.html',
  styleUrl: './link-download.component.scss'
})
export class LinkDownloadComponent implements OnInit
{
  hasError = false;
  loginForm: FormGroup;
  linkid: string = '';
  token: string = '';
  step3: boolean = false;
  fileName: string = '';
  otp: string = '';
  constructor(private downloadManagerService: DownloadManagerService, private fb: FormBuilder, private route: ActivatedRoute)
  {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
    });
  }

  ngOnInit(): void
  {
    this.linkid = this.route.snapshot.queryParamMap.get('linkid') || '';
    this.downloadManagerService.donwloadLink(this.linkid).subscribe(res =>
    {
      console.log('res', res);
      this.token = res.grantedToken;
      this.fileName = res.fileName;
      if (res.email != null && res.email != "" ) {
        this.loginForm.value.username = res.email;
        this.downloadManagerService.sendUserOptForToken({ tokenId: this.token, usernameOrEmail: this.loginForm.value.username }).subscribe(res => {
          this.step3 = true;
        }, error => {
          console.log('error', error);

        });
        console.log('Form Submitted', this.loginForm.value);
      }
    }, error =>
    {
      this.hasError = true;
      console.log('error', error);
    });
  }

  onSubmit(): void
  {
    if (this.loginForm.valid)
    {
      this.downloadManagerService.sendUserOptForToken({ tokenId: this.token, usernameOrEmail: this.loginForm.value.username }).subscribe(res =>
      {
        this.step3 = true;
      }, error =>
      {
        console.log('error', error);
      });
      console.log('Form Submitted', this.loginForm.value);
    }
  }

  getDownloadLink(otp: string)
  {
    this.downloadManagerService.downloadFromLinkWith2FA({ tokenId: this.token, twoFAcode: otp }).subscribe((response: Blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(response);
      a.href = objectUrl;
      a.download = this.fileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
    }, error => {
      this.hasError = true;
      console.error('File download error:', error);
    });
  }
}
