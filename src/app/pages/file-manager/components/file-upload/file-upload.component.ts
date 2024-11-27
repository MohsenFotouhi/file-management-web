import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { firstValueFrom } from 'rxjs'; // Import for converting observable to promise
import { FileManagerService } from 'src/app/services/file-manager.service';
import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgIf,
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

  constructor(
    public dialogRef: MatDialogRef<FileUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: FileManagerService
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

    // Close the dialog after all files are uploaded
    this.dialogRef.close(this.files);
  }

  // Upload the entire file in chunks synchronously
  private async uploadFileInChunks(file: File, fileIndex: number): Promise<void> {
    await this.uploadChunks(0, file, fileIndex); // Start uploading the file from chunk 0
  }

  // Recursive function to upload each chunk one after another
  private async uploadChunks(index: number, file: File, fileIndex: number): Promise<void> {
    const totalChunks = Math.ceil(file.size / this.chunkSize);
    const lastIndex = totalChunks - 1;

    const start = index * this.chunkSize;
    const end = Math.min(start + this.chunkSize, file.size);
    const chunk = file.slice(start, end);
    const chunkFile = new File([chunk], file.name, { type: file.type });
    try {
      // Use firstValueFrom to convert observable to promise and wait for it to complete
      await firstValueFrom(this.service.uploadFile("upload", this.data.currentPath, chunkFile));

      // Update the progress after successful upload of each chunk
      if (index < lastIndex) {
        this.uploadProgress[fileIndex] = Math.round((100 * index) / totalChunks);
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
