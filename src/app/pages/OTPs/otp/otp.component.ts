import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxQRCodeModule } from 'ngx-qrcode2';

@Component({
  selector: 'vex-otp',
  standalone: true,
  imports: [RouterLink, QRCodeModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OTPComponent {

  otp!: string;
  otpQrCode!: string;

  constructor() { }

  ngOnInit(): void {
    this.otp = this.generateOTP();
    this.otpQrCode = this.otp; // داده برای تولید QR Code
  }

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

}
