import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { File } from 'src/app/interface/files';
import { RenameDialogComponent } from './components/rename-dialog/rename-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ShareModalComponent } from './components/share-modal/share-modal.component';


@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) { }

  openRenameDialog(name: string): Promise<string | undefined> {
    const dialogRef = this.dialog.open(RenameDialogComponent, {
      data: { newName: name },
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

  openFileSharingDialog(files :File[]) {
    const dialogRef = this.dialog.open(ShareModalComponent, {
      data: { files: files },
      width: '500px'
    });

    return dialogRef.afterClosed();
  }

}
