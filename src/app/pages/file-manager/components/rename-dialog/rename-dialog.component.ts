import { Component, Inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

@Component({
  selector: 'app-rename-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './rename-dialog.component.html',
  styleUrls: ['./rename-dialog.component.css']
})
export class RenameDialogComponent {
  renameForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RenameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { newName: string }
  ) {
    this.renameForm = this.formBuilder.group({
      name: new FormControl(this.data.newName, [Validators.required, Validators.maxLength(200)])
    });
  }

  get name() {
    return this.renameForm.get('name');
  }

  onCancel(): void {
    this.dialogRef.close('');
  }

  onConfirm(): void {
    if (this.renameForm.valid) {
      this.dialogRef.close(this.renameForm.value.name);
    }
  }
}
