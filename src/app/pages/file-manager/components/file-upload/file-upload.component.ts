import { firstValueFrom } from 'rxjs';
import { Component, Inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileManagerService } from 'src/app/services/file-manager.service';
import {
  MatDialogRef,
  MatDialogState,
  MatDialogModule,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { IndexDBHelperService } from '../../../../services/index-db-helper.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    CommonModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressBarModule
  ],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'] // Fixed typo here
})
export class FileUploadComponent {
  files: File[] = [];
  chunkSize = 262144; // 256KB chunk size for upload
  uploadProgress: number[] = [];

  constructor(
    private service: FileManagerService,
    private dbHelper: IndexDBHelperService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FileUploadComponent>
  ) {
  }

  close(): void {
    this.dialogRef.close(false);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const dropzone = event.currentTarget as HTMLElement;
    dropzone.classList.add('dragover');
  }

  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    const input = event.dataTransfer;
    const dropzone = event.currentTarget as HTMLElement;
    dropzone.classList.remove('dragover');

    if (!input || !input.files || !input.files.length) return;

    for (const file of Array.from(input.files)) {
      this.files.push(file);
      this.uploadProgress.push(0); // Initialize upload progress for each file
    }
    // Start uploading files after drop
    await this.readyForUpload();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;

    for (const file of Array.from(input.files)) {
      this.files.push(file);
      this.uploadProgress.push(0); // Initialize upload progress for each file
    }

    // Start uploading files after drop
    await this.readyForUpload();
  }

  async readyForUpload(): Promise<void> {
    for (let i = 0; i < this.files.length; i++) {
      this.uploadProgress[i] = 0; // Initialize upload progress for each file
      await this.preUploadFile(this.files[i], i);
    }

    this.service.getUserStorageUse().subscribe();
    // Close the dialog after all files are uploaded
    this.dialogRef.close(this.files);
  }

  // Upload the entire file in chunks synchronously
  private async preUploadFile(file: File, fileIndex: number): Promise<void> {
    // Pre upload api call
    const response = await firstValueFrom(
      this.service.CallAPI('PreUpload', JSON.stringify({
        FilePath: this.data.currentPath,
        FileName: file.name,
        FileSize: file.size
      }))
    );

    const db = await this.dbHelper.openDB();
    await this.uploadChunks(db, 0, file, fileIndex, response.fileID); // Start uploading the file from chunk 0
  }

  // Recursive function to upload each chunk one after another
  private async uploadChunks(
    db: IDBDatabase,
    index: number,
    file: File,
    fileIndex: number,
    fileId: string
  ): Promise<void> {
    const totalChunks = Math.ceil(file.size / this.chunkSize);
    const start = index * this.chunkSize;
    const end = Math.min(start + this.chunkSize, file.size);
    const chunk = file.slice(start, end);
    const chunkFile = new File([chunk], file.name, { type: file.type });

    try {
      const state = this.dialogRef.getState();
      if (state === MatDialogState.CLOSED || state === MatDialogState.CLOSING) return;

      await this.dbHelper.saveChunk(db, this.dbHelper.UPLOAD_STORE_NAME, chunk, fileId);

      await firstValueFrom(
        this.service.uploadFile('upload', JSON.stringify({
          FilePath: this.data.currentPath,
          FileId: fileId
        }), chunkFile)
      );

      // Update the progress after successful upload of each chunk
      if (index < totalChunks - 1) {
        this.uploadProgress[fileIndex] = Math.round(
          (100 * index) / totalChunks
        );
        await this.uploadChunks(db, index + 1, file, fileIndex, fileId); // Recursively upload next chunk
      } else {
        await this.dbHelper.deleteFileChunks(db, this.dbHelper.UPLOAD_STORE_NAME, fileId);
        this.uploadProgress[fileIndex] = 100; // Upload complete
        console.log(`Upload complete for file: ${file.name}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  }
}
