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
import {
  DOWNLOAD_EXTENTIONS,
  PERSIAN_WEEK_DAYS,
  WeekDays
} from '@vex/config/constants';
import { ChipSelectComponent } from 'src/app/components/chip-select/chip-select.component';

import { TimepickerComponent } from 'src/app/components/timepicker/timepicker.component';

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
    MatSelectModule,
    ChipSelectComponent
  ]
})
export class GlobalSettingsDownloadComponenet implements OnChanges, OnInit {
  @Input() data: string;
  @Output() submitForm: EventEmitter<Storage> = new EventEmitter();
  downloadExtentionOptions = DOWNLOAD_EXTENTIONS;
  filteredDownloadExtentions = [...this.downloadExtentionOptions];
  weekDays = PERSIAN_WEEK_DAYS;
  allowDownloadSummaryText = '';
  denyDownloadSummaryText = '';
  disabledAllowDays: boolean[] = [];
  disabledDenyDays: boolean[] = [];
  form: FormGroup = this.fb.group({
    MaxSumByteDownPerDay: null,
    MaxSumByteDownPerMonth: null,
    CountDownPerDay: null,
    CountDownPerMonth: null,
    StartTimeDownLoad: null,
    EndTimeDownLoad: null,
    AllowExtentionDownLoad: '',
    DenyExtentionDownLoad: '',
    AllowDayDownLoad: '',
    DenyDayDownLoad: ''
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(): void {
    if (this.data) {
      this.form.patchValue(JSON.parse(this.data));
      this.handleDaysSelectChange();
      this.handleExtentionsChange();
    }
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.submitForm.emit(this.form.value);
  }

  handleExtentionsChange() {
    this.filteredDownloadExtentions = [];
    this.downloadExtentionOptions.forEach((option) => {
      if (
        this.form.value.AllowExtentionDownLoad.indexOf(option) === -1 &&
        this.form.value.DenyExtentionDownLoad.indexOf(option) === -1
      ) {
        this.filteredDownloadExtentions.push(option);
      }
    });
  }

  handleDaysSelectChange() {
    this.disabledAllowDays = [];
    this.disabledDenyDays = [];
    this.weekDays.forEach((day) => {
      this.disabledAllowDays.push(
        this.form.value.DenyDayDownLoad.indexOf(day.value) !== -1
      );
      this.disabledDenyDays.push(
        this.form.value.AllowDayDownLoad.indexOf(day.value) !== -1
      );
    });
    this.allowDownloadSummaryText =
      this.weekDays.find(
        (day) => day.value === this.form.value.AllowDayDownLoad[0]
      )?.name || '';
    this.denyDownloadSummaryText =
      this.weekDays.find(
        (day) => day.value === this.form.value.DenyDayDownLoad[0]
      )?.name || '';
  }
}
