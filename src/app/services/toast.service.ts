import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _snackBar = inject(MatSnackBar);

  open(
    message: string,
    duration = 4000,
    xPosition: MatSnackBarHorizontalPosition = 'center',
    yPosition: MatSnackBarVerticalPosition = 'bottom'
  ) {
    this._snackBar.open(message, 'بستن', {
      duration, // Duration in milliseconds
      horizontalPosition: xPosition,
      verticalPosition: yPosition
    });
  }
}
