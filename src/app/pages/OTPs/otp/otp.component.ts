import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { Observable } from 'rxjs';
import { OtpService } from 'src/app/services/otp.service';

@Component({
  selector: 'vex-otp',
  standalone: true,
  imports: [RouterLink, QRCodeModule, AsyncPipe, CommonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OTPComponent
{
  clickEvent(otp: string)
  {
    navigator.clipboard.writeText(otp);
  }

  otp!: string;
  otpQrCode!: string;

  constructor(private otpService: OtpService) { }
  otp$: Observable<any> | undefined;
  ngOnInit(): void
  {
    this.otp$ = this.otpService.getOtpConfig();
    this.otp = this.generateOTP();
    this.otpQrCode = this.otp; // داده برای تولید QR Code
  }

  generateOTP(): string
  {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

}
