import { firstValueFrom } from 'rxjs';
import { Component, Inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileManagerService } from 'src/app/services/file-manager.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
  MatDialogState
} from '@angular/material/dialog';

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
  previews: string[] = [];
  uploadProgress: number[] = [];
  fileId: string;
  fileName: string;
  isUploading = false;

  constructor(
    public dialogRef: MatDialogRef<FileUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: FileManagerService
  ) {}

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
    const dropzone = event.currentTarget as HTMLElement;
    dropzone.classList.remove('dragover');

    if (event.dataTransfer?.files) {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        this.files.push(event.dataTransfer.files[i]);
        this.previews.push(URL.createObjectURL(event.dataTransfer.files[i]));
        this.uploadProgress.push(0); // Initialize upload progress for each file
      }

      // Start uploading files after drop
      await this.upload();
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;

    for (const file of Array.from(input.files)) {
      this.files.push(file);
      this.uploadProgress.push(0); // Initialize upload progress for each file
    }

    // Start uploading files after drop
    await this.upload();
  }

  async upload(): Promise<void> {
    // Call uploadFileInChunks for each file in sequence using for...of loop with await
    for (let i = 0; i < this.files.length; i++) {
      this.uploadProgress[i] = 0; // Initialize upload progress for each file
      await this.uploadFileInChunks(this.files[i], i);
    }

    this.service.getUserStorageUse().subscribe();
    // Close the dialog after all files are uploaded
    this.dialogRef.close(this.files);
  }

  // Upload the entire file in chunks synchronously
  private async uploadFileInChunks(
    file: File,
    fileIndex: number
  ): Promise<void> {

    this.fileName = file.name;
    const temp = {
      FilePath: this.data.currentPath,
      FileName: file.name,
      FileSize: file.size
    };
    // Pre upload api call
    const response = await firstValueFrom(
      this.service.CallAPI('PreUpload', JSON.stringify(temp))
    );
    this.fileId = response.fileID;
  
    await this.uploadChunks(0, file, fileIndex); // Start uploading the file from chunk 0
  }

  // Recursive function to upload each chunk one after another
  private async uploadChunks(
    index: number,
    file: File,
    fileIndex: number
  ): Promise<void> {
    const totalChunks = Math.ceil(file.size / this.chunkSize);
    const lastIndex = totalChunks - 1;

    const start = index * this.chunkSize;
    const end = Math.min(start + this.chunkSize, file.size);
    const chunk = file.slice(start, end);
    const chunkFile = new File([chunk], file.name, { type: file.type });

    try {
      const state = this.dialogRef.getState();
      if (state === MatDialogState.CLOSED || state === MatDialogState.CLOSING) {
        return;
      }
      // Use firstValueFrom to convert observable to promise and wait for it to complete
      const uploadtemp = {
        FilePath: this.data.currentPath,
        FileId: this.fileId,
      };

      await firstValueFrom(
        this.service.uploadFile('upload', JSON.stringify(uploadtemp), chunkFile)
      );

      // Update the progress after successful upload of each chunk
      if (index < lastIndex) {
        this.uploadProgress[fileIndex] = Math.round(
          (100 * index) / totalChunks
        );
        await this.uploadChunks(index + 1, file, fileIndex); // Recursively upload next chunk
      } else {
        this.uploadProgress[fileIndex] = 100; // Upload complete
        console.log(`Upload complete for file: ${file.name}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  }
}
