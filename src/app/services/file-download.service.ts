import { Injectable } from '@angular/core';
import { IndexDBHelperService } from './index-db-helper.service';
import { DownloadManagerService } from './download-manager.service';
import { BehaviorSubject, from, lastValueFrom, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {
  private maxConcurrency = 4;
  private chunkSize = 1024 * 1024; // 1MB
  public progress$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public isDownloadWithIDM$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private dbHelper: IndexDBHelperService,
              private downloadManagerService: DownloadManagerService) {
  }

  async downloadFile(fileUrl: string, totalSize: number) {
    const db = await this.dbHelper.openDB();
    const totalChunks = Math.ceil(totalSize / this.chunkSize);
    const missingChunks = await this.getMissingChunks(db, totalChunks);

    let completedChunks = 0;

    from(missingChunks)
      .pipe(
        mergeMap(
          (chunkIndex) =>
            this.downloadAndSaveChunk(db, fileUrl, chunkIndex).then(() => {
              completedChunks++;
              const progress = (completedChunks / totalChunks) * 100;
              this.progress$.next(progress);
              return chunkIndex;
            }),
          this.maxConcurrency
        )
      )
      .subscribe({
        next: (chunkIndex) => console.log(`Chunk ${chunkIndex + 1} downloaded.`),
        error: (err) => {
          if (navigator.onLine) {
            if (err.status === 0) {
              this.isDownloadWithIDM$.next(true);
              console.error('block with IDM: ', err);
            } else {
              this.isDownloadWithIDM$.next(false);
              console.error('Error downloading chunk:', err);
            }
          } else {
            this.isDownloadWithIDM$.next(false);
            console.error('network error: ', err);
          }
        },
        complete: async () => {
          console.log('All chunks downloaded.');
          await this.combineChunks(db, totalChunks);
          this.progress$.next(100);
        }
      });
  }

  private async downloadAndSaveChunk(db: IDBDatabase, fileUrl: string, chunkIndex: number): Promise<number> {
    const start = chunkIndex * this.chunkSize;
    const end = Math.min(start + this.chunkSize - 1, await this.getFileSize(fileUrl));

    const chunk = await lastValueFrom(
      this.downloadManagerService.downloadChunk(fileUrl, start, end)
    );
    await this.dbHelper.saveChunk(db, chunk, `chunk-${chunkIndex}`);
    return chunkIndex;
  }

  private async getMissingChunks(db: IDBDatabase, totalChunks: number): Promise<number[]> {
    const keys = await this.dbHelper.getAllKeys(db);
    const downloadedChunks = keys.map((key) => parseInt(key.split('-')[1], 10));
    const missingChunks = [];
    for (let i = 0; i < totalChunks; i++) {
      if (!downloadedChunks.includes(i)) {
        missingChunks.push(i);
      }
    }
    return missingChunks;
  }

  private async combineChunks(db: IDBDatabase, totalChunks: number): Promise<void> {
    const chunks: Blob[] = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunk = await this.dbHelper.getChunk(db, `chunk-${i}`);
      if (chunk) chunks.push(chunk);
    }

    await this.dbHelper.cleanupIndexedDB(db);

    const fileBlob = new Blob(chunks);
    const url = URL.createObjectURL(fileBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'downloaded-file';
    a.click();
    URL.revokeObjectURL(url);
  }

  async getFileSize(fileUrl: string): Promise<number> {
    // const response = await fetch(fileUrl, { method: 'HEAD' });
    // return parseInt(response.headers.get('content-length') || '0', 10);
    return 2102720520 - 1;
  }
}
