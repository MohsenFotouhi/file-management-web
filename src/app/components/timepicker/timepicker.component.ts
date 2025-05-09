import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  formControl = new FormControl('');

  // ngOnChanges(changes: SimpleChanges): void {
    // if (this.form.value[this.controlName]) {
    //   this.formControl.setValue(this.form.value[this.controlName])
    // }
  // }

  // handleTimeSet(event: string) {
  //   let date = new Date();
  //   date.setHours(+event.split(':')[0], +event.split(':')[1], 0);
  //   this.form.controls[this.controlName].setValue(date.toString());
  // }
}
