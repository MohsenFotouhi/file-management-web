import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@Component({
  selector: 'app-timepicker',
  standalone: true,
  templateUrl: './timepicker.component.html',
  styleUrl: './timepicker.component.scss',
  imports: [
    NgxMaterialTimepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class TimepickerComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() controlName = '';
  @Input() public form: FormGroup;
}
