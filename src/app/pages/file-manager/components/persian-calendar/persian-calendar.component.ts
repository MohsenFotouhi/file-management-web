import { NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'jalali-moment';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'persian-calendar',
  standalone: true,
  imports: [NgFor],
  templateUrl: './persian-calendar.component.html',
  styleUrl: './persian-calendar.component.scss'
})
export class PersianCalendarComponent implements OnInit {

  currentDate: moment.Moment;
  daysOfWeek: string[] = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  daysInMonth: (number)[] = [];

  selectedDate: moment.Moment;
  selectedDay!: any;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentDate = moment().locale('fa');  // تنظیم به تاریخ شمسی
    this.selectedDate = this.currentDate.clone();
    this.daysInMonth = this.getDaysInMonth();
  }

  ngOnInit(): void { 
    this.generateCalendar();
  }


  generateCalendar() {
    // تعداد روزهای ماه جاری
    const daysInMonth = this.currentDate.daysInMonth();

    // روز شروع ماه (از چه روزی هفته شروع می‌شود)
    const startDayOfWeek = this.currentDate.clone().startOf('month').weekday();

    // ایجاد یک آرایه که ابتدا با null شروع می‌شود تا روزهای خالی را پر کند
    this.daysInMonth = Array(startDayOfWeek).fill(null).concat(
      Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );
  }

  getDaysInMonth(): number[] {
    const daysInMonth = this.currentDate.daysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  previousMonth() {
    this.currentDate.subtract(1, 'month');
    this.generateCalendar(); // بازتولید تقویم برای ماه جدید
    this.selectedDay = undefined;
  }

  nextMonth() {
    this.currentDate.add(1, 'month');
    this.generateCalendar(); // بازتولید تقویم برای ماه جدید
    this.selectedDay = undefined;
  }

  selectDay(day: number) {
    this.selectedDay = day;
    this.selectedDate = this.currentDate.clone().date(day);
  }

  onConfirm() {
    this.dialogRef.close(this.selectedDate.format('YYYY/MM/DD'));
  }

  onCancel() {
    this.dialogRef.close();
  }

}
