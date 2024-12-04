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
import { MatSelectModule } from '@angular/material/select';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { DOWNLOAD_EXTENTIONS, PERSIAN_WEEK_DAYS } from '@vex/config/constants';
import { ChipSelectComponent } from 'src/app/components/chip-select/chip-select.component';

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
    MatSelectModule,
    ChipSelectComponent
  ]
})
export class GlobalSettingsUploadComponenet implements OnChanges {
  @Input() data: string;
  @Output() submitForm: EventEmitter<Storage> = new EventEmitter();
  uploadExtentionOptions = DOWNLOAD_EXTENTIONS;
  filteredUploadExtentions = [...this.uploadExtentionOptions];
  weekDays = PERSIAN_WEEK_DAYS;
  allowUploadSummaryText = '';
  denyUploadSummaryText = '';
  disabledAllowDays: boolean[] = [];
  disabledDenyDays: boolean[] = [];
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

  ngOnChanges(): void {
    if (this.data) {
      this.form.patchValue(JSON.parse(this.data));
      this.handleExtentionsChange();
      this.handleDaysSelectChange();
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.submitForm.emit(this.form.value);
  }

  handleExtentionsChange() {
    this.filteredUploadExtentions = [];
    this.uploadExtentionOptions.forEach((option) => {
      if (
        this.form.value.AllowExtestionUpload.indexOf(option) === -1 &&
        this.form.value.DenyExtestionUpload.indexOf(option) === -1
      ) {
        this.filteredUploadExtentions.push(option);
      }
    });
  }

  handleDaysSelectChange() {
    this.disabledAllowDays = [];
    this.disabledDenyDays = [];
    this.weekDays.forEach((day) => {
      this.disabledAllowDays.push(
        this.form.value.DenyDayUpload.indexOf(day.value) !== -1
      );
      this.disabledDenyDays.push(
        this.form.value.AllowDayUpload.indexOf(day.value) !== -1
      );
    });
    this.allowUploadSummaryText =
      this.weekDays.find(
        (day) => day.value === this.form.value.AllowDayUpload[0]
      )?.name || '';
    this.denyUploadSummaryText =
      this.weekDays.find(
        (day) => day.value === this.form.value.DenyDayUpload[0]
      )?.name || '';
  }
}
