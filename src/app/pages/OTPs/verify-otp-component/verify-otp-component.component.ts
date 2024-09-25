import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'vex-verify-otp-component',
  standalone: true,
  imports: [],
  templateUrl: './verify-otp-component.component.html',
  styleUrl: './verify-otp-component.component.scss'
})
export class VerifyOtpComponentComponent {
  otp!: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // دریافت OTP از پارامترهای URL
    this.route.params.subscribe(params => {
      this.otp = params['otp'];
    });
  }

  verifyOTP() {
    // کد برای بررسی صحت OTP
    console.log("OTP وارد شده:", this.otp);
  }
}
