import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { RenameDialogComponent } from './rename-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) { }

  openRenameDialog(currentName: string): Promise<string | undefined> {
    const dialogRef = this.dialog.open(RenameDialogComponent, {
      data: { newName: currentName },
      width: '500px'
    });

    return dialogRef.afterClosed().toPromise();
  }

  openConfirmationDialog(message : string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { message: message },
      width: '500px'
    });

    return dialogRef.afterClosed().toPromise();
  }

  openUploadDialog(currentPath : string): Promise<File[]> {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      data: { currentPath: currentPath },
      width: '500px'
    });

    return dialogRef.afterClosed().toPromise();
  }

}
