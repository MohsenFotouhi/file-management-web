import { NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'vex-share-detail',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor
  ],
  templateUrl: './share-detail.component.html',
  styleUrl: './share-detail.component.scss'
})
export class ShareDetailComponent {

  sharedby: [] = [];

  constructor(
    public dialogRef: MatDialogRef<ShareDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sharedby = data.sharedby;
  }


  onCancel(): void {
    this.dialogRef.close(false);
  }
}
