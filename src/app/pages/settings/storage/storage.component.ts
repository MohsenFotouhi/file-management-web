import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { CreateUserSetting } from 'src/app/interface/auth-interface';

@Component({
  selector: 'settings-storage',
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.scss',
  standalone: true,
  animations: [fadeInUp400ms],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf
  ]
})
export class SettingsStorageComponent implements OnInit {
  @Input() data: string;
  @Output() submitForm: EventEmitter<Storage> = new EventEmitter();
  form: FormGroup = this.fb.group({
    maxUserStorage: [null, Validators.required],
    maxCountFile: [null, Validators.required],
    maxCountFolder: [null, Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(JSON.parse(this.data));
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.submitForm.emit(this.form.value);
  }
}
