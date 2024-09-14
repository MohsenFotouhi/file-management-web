import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {fadeInUp400ms} from '@vex/animations/fade-in-up.animation';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AuthService} from '../auth.service';
import {LoginModel} from 'src/app/interface/auth-interface';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatCheckboxModule,
    RouterLink,
    MatSnackBarModule
  ]
})
export class LoginComponent {

  form = this.fb.group<any>({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  inputType = 'password';
  visible = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) {
  }

  send() {
    if (this.form.valid) {
      const obj: any = {username: this.form.value['username'], password: this.form.value['password']}
      this.authService.login(obj).subscribe(res => {
        if (res) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('userInfo', JSON.stringify(res.userInfo));
          this.authService.setUser();
          this.router.navigate(['/']);
          this.snackbar.open(
            "ورود با موفقیت انجام شد",
            '',
            {duration: 1000, verticalPosition: 'top', direction: 'rtl'}
          );
        } else {
          this.snackbar.open(
            "متاسفیم! ورود انجام نشد لطفا مجددا تلاش کنید.",
            '',
            {duration: 1000, verticalPosition: 'top', direction: 'rtl'}
          );
        }
      }, () => {
        this.snackbar.open(
          "متاسفیم! ورود انجام نشد لطفا مجددا تلاش کنید.",
          '',
          {duration: 1000, verticalPosition: 'top', direction: 'rtl'}
        );
      })
    }
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}
