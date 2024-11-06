import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'vex-user-file-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDividerModule],
  templateUrl: './user-file-dialog.component.html',
  styleUrl: './user-file-dialog.component.scss'
})
export class UserFileDialogComponent
{
  constructor(@Inject(MAT_DIALOG_DATA) public data: any)
  {

  }
}
