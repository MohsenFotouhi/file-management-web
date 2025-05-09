import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { OtpType } from '@vex/config/constants';
import { enumToAarray } from 'src/app/shared/utils/enum-utils';

@Component({
  selector: 'global-settings-otp',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule
  ],
  animations: [fadeInUp400ms],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class GlobalSettingsOtpComponent implements OnChanges, OnInit {
  @Input() data: string;
  @Output() submitForm: EventEmitter<Storage> = new EventEmitter();
  sendTypes: Array<{ key: string; value: number }>;
  sendTypesEnum = OtpType;
  form: FormGroup = this.fb.group({
    SendType: null,
    DownloadVerificationMethod: null,
    TextEmail: ['', Validators.pattern(/\[OTP\]/)],
    TextSms: ['', Validators.pattern(/\[OTP\]/)],
    TextToken: '',
    LinkUrl: '',
    SecretKey: '',
    TimeOut: null,
    Issuer: '',
    TextEmailLink: ['', Validators.pattern(/\[LINK\]/)]
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(): void {
    if (this.data) {
      this.form.patchValue(JSON.parse(this.data));
    }
  }

  ngOnInit(): void {
    this.sendTypes = enumToAarray(OtpType);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.submitForm.emit(this.form.value);
  }
}
