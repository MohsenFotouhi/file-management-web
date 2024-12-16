import { Component, Inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileManagerService } from 'src/app/services/file-manager.service';
import { IndexDBHelperService } from '../../../../services/index-db-helper.service';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  from,
  defer,
  EMPTY,
  Subject,
  finalize,
  concatMap,
  takeUntil,
  switchMap,
  catchError,
  Observable,
  firstValueFrom
} from 'rxjs';

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
  private chunkSize = 256 * 1024; // 256KB
  private cancelUpload$ = new Subject<void>();
  filesProgress: { name: string; id: string; progress: number; error?: string }[] = [];
  filesUploaded: { file: File, fileId: string }[] = [];

  db: IDBDatabase;

  constructor(
    private dbHelper: IndexDBHelperService,
    private fileManager: FileManagerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FileUploadComponent>
  ) {
    dialogRef.disableClose = true;
  }

  async close(): Promise<void> {
    this.cancelUpload$.next();
    this.cancelUpload$.complete();
    for (const f of this.filesUploaded) {
      await this.deleteUploadedFile(this.db, f.file, f.fileId);
    }
    await firstValueFrom(this.fileManager.getUserStorageUse());
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

    const db = await this.dbHelper.openDB();

    const files: File[] = Array.from(input.files);
    files.map((file) => {
      this.preUploadFile(db, file);
    });
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;

    this.db = await this.dbHelper.openDB();
    const files: File[] = Array.from(input.files);
    files.map((file) => {
      this.preUploadFile(this.db, file);
    });
  }

  // Upload the entire file in chunks synchronously
  private async preUploadFile(db: IDBDatabase, file: File): Promise<void> {
    // Pre upload api call
    const response = await firstValueFrom(
      this.fileManager.CallAPI('PreUpload', JSON.stringify({
        FilePath: this.data.currentPath,
        FileName: file.name,
        FileSize: file.size
      }))
    );

    this.filesUploaded.push({ file: file, fileId: response.fileID });
    await this.saveChunkToDb(db, file, response.fileID);
  }

  async saveChunkToDb(db: IDBDatabase, file: File, fileId: string) {
    const totalChunks = Math.ceil(file.size / this.chunkSize);

    // Initialize progress tracking
    this.filesProgress.push({ name: file.name, id: fileId, progress: 0 });

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * this.chunkSize;
      const end = Math.min(start + this.chunkSize, file.size);
      const chunk = file.slice(start, end);

      // Save chunk in IndexedDB
      await this.dbHelper.saveChunk(db, this.dbHelper.UPLOAD_STORE_NAME, chunk, `${fileId}-${chunkIndex}`);
    }

    // Upload all chunks
    this.uploadChunks(db, file, fileId, totalChunks);
  }

  uploadChunks(db: IDBDatabase, file: File, fileId: string, totalChunks: number) {
    const fileProgress = this.filesProgress.find((fp) => fp.id === fileId);

    let uploadedChunks = 0;

    from(Array.from({ length: totalChunks }).map((_, chunkIndex) => chunkIndex))
      .pipe(
        concatMap((chunkIndex) =>
          from(this.dbHelper.getChunk(db, this.dbHelper.UPLOAD_STORE_NAME, `${fileId}-${chunkIndex}`)).pipe(
            concatMap((chunk) =>
              this.uploadChunk(file, chunk, fileId).pipe(
                finalize(() => {
                  uploadedChunks++;
                  if (fileProgress) {
                    fileProgress.progress = Math.round((uploadedChunks / totalChunks) * 100);
                  }
                })
              )
            )
          )
        ),
        takeUntil(this.cancelUpload$),
        catchError(async (err) => {
          console.error('Error uploading chunk:', err);
          return this.errorUploading(db, file, fileId);
        }),
        finalize(() => {
          // Cleanup IndexedDB after success
          defer(() => this.dbHelper.deleteFileChunks(db, this.dbHelper.UPLOAD_STORE_NAME, fileId)).pipe(
            catchError((err) => {
              console.error('Error during cleanup:', err);
              return EMPTY;
            })
          ).subscribe(() => {
            if (fileProgress) {
              fileProgress.progress = 100;
            }
          });
        })
      )
      .subscribe({
        error: (err) => {
          console.error('Error uploading file:', err);
          if (fileProgress) {
            fileProgress.error = `Error uploading file: ${err.message}`;
          }
        },
        complete: () => {
          this.close();
        }
      });
  }

  uploadChunk(file: File, chunk: Blob, fileId: string) {
    return this.fileManager.uploadFile('upload',
      JSON.stringify({
        FilePath: this.data.currentPath,
        FileId: fileId
      }),
      new File([chunk], file.name, { type: file.type }));
  }

  errorUploading(db: IDBDatabase, file: File, fileId: string): Observable<never> {
    return from(
      (async () => {
        const fileProgress = this.filesProgress.find((fp) => fp.id === fileId);

        await this.deleteUploadedFile(db, file, fileId);
        if (fileProgress) {
          fileProgress.error = `Error uploading file`;
          fileProgress.progress = 0;
        }
      })()
    ).pipe(
      switchMap(() => EMPTY)
    );
  }

  async deleteUploadedFile(db: IDBDatabase, file: File, fileId: string): Promise<void> {
    await this.dbHelper.deleteFileChunks(db, this.dbHelper.UPLOAD_STORE_NAME, fileId);
    //Add double slash if in doesn't have it
    const temp = (this.data.currentPath as string).endsWith('\\') ? '' : '\\';
    const data = {
      Path: this.data.currentPath,
      ParentDirectoryID: this.data.file?.fileId,
      Items: [`${this.data.currentPath}${temp}${file.name}`],
      ListId: [fileId]
    };
    await firstValueFrom(
      this.fileManager.CallAPI('Delete', JSON.stringify(data))
    );
  }
}
