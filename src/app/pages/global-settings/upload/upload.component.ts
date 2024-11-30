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

import { CreateUserSetting } from 'src/app/interface/auth-interface';

@Component({
  selector: 'global-settings-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
  standalone: true,
  animations: [fadeInUp400ms],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule
  ]
})
export class GlobalSettingsUploadComponenet {
  @Input() data: CreateUserSetting;
  @Output() submitForm: EventEmitter<Storage> = new EventEmitter();
  options = ['Option1', 'Option2', 'Option3', 'Option4', 'Option5'];
  form: FormGroup = this.fb.group({
    MaxByteUpload: [null, Validators.required],
    MaxDataUpload: [null, Validators.required],
    CountUploadPerDay: [null, Validators.required],
    CountUploadPerMonth: [null, Validators.required],
    // StartTimeUpload: [null],
    // EndTimeUpload: [null],
    AllowExtestionUpload: ['', Validators.required],
    DenyExtestionUpload: ['', Validators.required],
    AllowDayUpload: ['', Validators.required],
    DenyDayUpload: ['', Validators.required]
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
