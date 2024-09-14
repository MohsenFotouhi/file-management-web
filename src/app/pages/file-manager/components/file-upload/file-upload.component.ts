import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgFor, NgIf } from '@angular/common';
import { FileManagerService } from 'src/app/services/file-manager.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    NgIf
  ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  files: File[] = [];
  chunkSize = 10000000; // 200MB

  previews: string[] = [];
  uploadProgress: number[] = [];


  constructor(
    public dialogRef: MatDialogRef<FileUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: FileManagerService
  ) { }

  close(): void {
    this.dialogRef.close(false);
  }

  upload(): void {
    this.dialogRef.close(this.files);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const dropzone = event.currentTarget as HTMLElement;
    dropzone.classList.add('dragover');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const dropzone = event.currentTarget as HTMLElement;
    dropzone.classList.remove('dragover');

    if (event.dataTransfer?.files) {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        this.files.push(event.dataTransfer.files[i]);
        this.previews.push(URL.createObjectURL(event.dataTransfer.files[i]));
        this.uploadFileInChunks(event.dataTransfer.files[i], this.files.indexOf(event.dataTransfer.files[i]));
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        this.files.push(input.files[i]);
        const fileType = input.files[i].type;

        if (fileType === "image/png" ||
          fileType === "image/jpeg" ||
          fileType === "image/gif" ||
          fileType === "image/svg+xml" ||
          fileType === "image/webp") {
          this.previews.push(URL.createObjectURL(input.files[i]));
        }
        else if (input.files[i].name.endsWith("dll"))
          this.previews.push("img/dll.png");
        else if (input.files[i].name.endsWith("css"))
          this.previews.push("img/css.png");
        else if (input.files[i].name.endsWith("exe"))
          this.previews.push("img/exe.png");
        else if (input.files[i].name.endsWith("file"))
          this.previews.push("img/file.png");
        else if (input.files[i].name.endsWith("folder"))
          this.previews.push("img/folder.png");
        else if (input.files[i].name.endsWith("folder"))
          this.previews.push("img/folder.png");
        else if (input.files[i].name.endsWith("html"))
          this.previews.push("img/html.png");
        else if (input.files[i].name.endsWith("js"))
          this.previews.push("img/js.png");
        else if (input.files[i].name.endsWith("json"))
          this.previews.push("img/json.png");
        else if (input.files[i].name.endsWith("MP3"))
          this.previews.push("img/MP3.png");
        else if (input.files[i].name.endsWith("MP4"))
          this.previews.push("img/MP4.png");
        else if (input.files[i].name.endsWith("pdf"))
          this.previews.push("img/pdf.png");
        else if (input.files[i].name.endsWith("php"))
          this.previews.push("img/php.png");
        else if (input.files[i].name.endsWith("txt"))
          this.previews.push("img/txt.png");
        else if (input.files[i].name.endsWith("zip"))
          this.previews.push("img/zip.png");
        else
          this.previews.push("");
        this.uploadProgress.push(0);
        this.uploadFileInChunks(input.files[i], this.files.indexOf(input.files[i]));
      }
    }
  }


  private uploadFileInChunks(file: File, fileIndex: number) {
    this.upload1(0, file, fileIndex);
  }

  upload1(index: number, file: File, fileIndex: number) {
    let totalChunks = Math.ceil(file.size / this.chunkSize);

    let lastIndex: number = totalChunks - 1;

    const start = index * this.chunkSize;
    const end = Math.min(start + this.chunkSize, file.size);
    const chunk = file.slice(start, end);
    var chunkfile = new File([chunk], file.name, { type: file.type });
    // this.service.uploadFile("upload", this.data.currentPath, chunkfile).subscribe(
    //   response => {
    //     if (lastIndex != index) {

    //       this.upload1(index + 1, file, fileIndex)
    //       this.uploadProgress[fileIndex] = Math.round((100 * index) / totalChunks);
    //     }
    //     else {
    //       this.uploadProgress[fileIndex] = 100;
    //       console.log('Upload complete');
    //     }
    //   },
    //   error => {
    //     console.error('upload error:', error);
    //   });
  }

}



