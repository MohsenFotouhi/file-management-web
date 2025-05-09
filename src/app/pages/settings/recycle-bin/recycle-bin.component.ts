import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { CreateUserSetting } from 'src/app/interface/auth-interface';

@Component({
  selector: 'settings-recycle-bin',
  templateUrl: './recycle-bin.component.html',
  styleUrl: './recycle-bin.component.scss',
  standalone: true,
  animations: [fadeInUp400ms],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSlideToggleModule
  ]
})
export class SettingsRecycleBinComponent implements OnChanges {
  @Input() data: string;
  @Output() formSubmit = new EventEmitter();
  form: FormGroup = this.fb.group({
    UserCanPhysicalDelete: [false],
    UserCanRestore: [false],
    AdminAllowDelete: [false]
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(): void {
    if (this.data) {
      this.form.patchValue(JSON.parse(this.data));
    }
  }

  onSubmit() {
    this.formSubmit.emit(this.form.value);
  }
}
