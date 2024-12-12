import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
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
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';

@Component({
  selector: 'global-settings-ldap',
  templateUrl: './ldap.component.html',
  styleUrl: './ldap.component.scss',
  standalone: true,
  animations: [fadeInUp400ms],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ]
})
export class GlobalSettingsLDAPComponent implements OnChanges {
  @Input() data: string;
  @Output() submitForm: EventEmitter<Storage> = new EventEmitter();
  form: FormGroup = this.fb.group({
    Server: '',
    Port: null,
    DomainName: '',
    DC: '',
    Username: '',
    Password: ''
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(): void {
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
