import { Component, EventEmitter, Input, Output } from '@angular/core';
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

import { TimepickerComponent } from 'src/app/components/timepicker/timepicker.component';
import { CreateUserSetting } from 'src/app/interface/auth-interface';

@Component({
  selector: 'global-settings-download',
  templateUrl: './download.component.html',
  styleUrl: './download.component.scss',
  standalone: true,
  animations: [fadeInUp400ms],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    TimepickerComponent,
    MatSelectModule
  ]
})
export class GlobalSettingsDownloadComponenet {
  @Input() data: CreateUserSetting;
  @Output() submitForm: EventEmitter<Storage> = new EventEmitter();
  options = ['Option1', 'Option2', 'Option3', 'Option4', 'Option5'];
  form: FormGroup = this.fb.group({
    MaxSumByteDownPerDay: [null, Validators.required],
    MaxSumByteDownPerMonth: [null, Validators.required],
    CountDownPerDay: [null, Validators.required],
    CountDownPerMonth: [null, Validators.required],
    StartTimeDownLoad: [null],
    EndTimeDownLoad: [null],
    AllowExtentionDownLoad: ['', Validators.required],
    DenyExtentionDownLoad: ['', Validators.required],
    AllowDayDownLoad: ['', Validators.required],
    DenyDayDownLoad: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(JSON.parse(this.data.storageSetting));
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.submitForm.emit(this.form.value);
  }
}