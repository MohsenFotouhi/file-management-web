import { Component, OnInit } from '@angular/core';
import { concatMap, finalize, firstValueFrom, from, retry } from 'rxjs';
import { FileManagerService } from '../../services/file-manager.service';
import { IndexDBHelperService } from '../../services/index-db-helper.service';

@Component({
  selector: 'vex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  ngOnInit(): void {
  }

  filesProgress: { fileName: string; fileId: string; progress: number; error?: string }[] = [];
  private chunkSize = 1024 * 1024; // 1MB

  constructor(private dBHelper: IndexDBHelperService,
              private fileManager: FileManagerService) {
  }

  async onFileSelected(event: any) {
    const db = await this.dBHelper.openDB();
    const files: File[] = Array.from(event.target.files);
    files.map((file) => {
      this.preUploadFile(db, file);
    });
  }


  // Upload the entire file in chunks synchronously
  private async preUploadFile(db: IDBDatabase, file: File): Promise<void> {
    // Pre upload api call
    const response = await firstValueFrom(
      this.fileManager.CallAPI('PreUpload', JSON.stringify({
        FilePath: 'Root\\',
        FileName: file.name,
        FileSize: file.size
      }))
    );

    await this.uploadFile(db, file, response.fileID);
  }

  async uploadFile(db: IDBDatabase, file: File, fileId: string) {
    const totalChunks = Math.ceil(file.size / this.chunkSize);

    // Initialize progress tracking
    this.filesProgress.push({ fileName: file.name, fileId: fileId, progress: 0 });

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * this.chunkSize;
      const end = Math.min(start + this.chunkSize, file.size);
      const chunk = file.slice(start, end);

      // Save chunk in IndexedDB
      await this.dBHelper.saveChunk(db, this.dBHelper.UPLOAD_STORE_NAME, chunk, `${fileId}-${chunkIndex}`);
    }

    // Upload all chunks
    this.uploadChunks(db, file, fileId, totalChunks);
  }

  uploadChunks(db: IDBDatabase, file: File, fileId: string, totalChunks: number) {
    const fileProgress = this.filesProgress.find((fp) => fp.fileName === file.name);

    let uploadedChunks = 0;

    from(Array.from({ length: totalChunks }).map((_, chunkIndex) => chunkIndex))
      .pipe(
        concatMap((chunkIndex) =>
          from(this.dBHelper.getChunk(db, this.dBHelper.UPLOAD_STORE_NAME, `${fileId}-${chunkIndex}`)).pipe(
            concatMap((chunk) =>
              this.uploadChunk(file, chunk, fileId).pipe(
                retry(2),
                finalize(() => {
                  // افزایش شمارنده قطعات آپلود شده
                  uploadedChunks++;
                  if (fileProgress) {
                    fileProgress.progress = Math.round((uploadedChunks / totalChunks) * 100);
                  }
                })
              )
            )
          )
        ),
        finalize(() => {
          // Cleanup IndexedDB after success
          this.dBHelper.deleteFileChunks(db, this.dBHelper.UPLOAD_STORE_NAME, fileId);
          if (fileProgress) {
            fileProgress.progress = 100; // آپلود تکمیل شد
          }
        })
      )
      .subscribe({
        error: (err) => {
          console.error('Error uploading file:', err);
          if (fileProgress) {
            fileProgress.error = `Error uploading file: ${err.message}`;
          }
        }
      });
  }

  uploadChunk(file: File, chunk: Blob, fileId: string) {
    return this.fileManager.uploadFile('upload',
      JSON.stringify({
        FilePath: 'Root\\',
        FileId: fileId
      }),
      new File([chunk], file.name, { type: file.type }));
  }
}
