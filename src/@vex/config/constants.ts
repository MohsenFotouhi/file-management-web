import { CSSValue } from '../interfaces/css-value.type';

export const defaultRoundedButtonBorderRadius: CSSValue = {
  value: 9999,
  unit: 'px'
};

export const DOWNLOAD_EXTENTIONS = [
  '.exe',
  '.txt',
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.docs'
];

export const PERSIAN_WEEK_DAYS = [
  {
    name: 'شنبه',
    value: 'Saturday'
  },
  {
    name: 'یکشنبه',
    value: 'Sunday'
  },
  {
    name: 'دوشنبه',
    value: 'Monday'
  },
  {
    name: 'سه شنبه',
    value: 'Tuesday'
  },
  {
    name: 'چهارشنبه',
    value: 'Wednesday'
  },
  {
    name: 'پنجشنبه',
    value: 'Thursday'
  },
  {
    name: 'جمعه',
    value: 'Friday'
  }
];

export enum WeekDays {
  Saturday = 'شنبه',
  Sunday = 'یکشنبه',
  Monday = 'دوشنبه',
  Tuesday = 'سه شنبه',
  Wednesday = 'چهارشنبه',
  Thursday = 'پنجشنبه',
  Friday = 'جمعه'
}

export enum OtpType {
  Email = 1,
  Sms = 2,
  App = 3,
  // Link = 4,
  // None = 0
}
