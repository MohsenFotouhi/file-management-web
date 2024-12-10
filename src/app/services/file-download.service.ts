import { Injectable } from '@angular/core';
import { IndexDBHelperService } from './index-db-helper.service';
import { DownloadManagerService } from './download-manager.service';
import { BehaviorSubject, from, lastValueFrom, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {
  private readonly maxConcurrency = 4;
  private readonly chunkSize = 1024 * 256; // 256KB
  public progress$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  isDownloadWithIDM$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private dbHelper: IndexDBHelperService,
              private downloadManagerService: DownloadManagerService) {
  }

  async downloadFile(fileUrl: string, totalSize: number, fileId: string) {
    const storeName = `download-${fileId}`;
    const db = await this.dbHelper.openDB(storeName);
    const totalChunks = Math.ceil(totalSize / this.chunkSize);
    const missingChunks = await this.getMissingChunks(db, storeName, totalChunks);

    let completedChunks = 0;

    from(missingChunks)
      .pipe(
        mergeMap(
          (chunkIndex) =>
            this.downloadAndSaveChunk(db, storeName, fileUrl, chunkIndex, totalSize).then(() => {
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
          await this.combineChunks(db, storeName, totalChunks);
          this.progress$.next(100);
        }
      });
  }

  private async downloadAndSaveChunk(db: IDBDatabase, storeName: string, fileUrl: string, chunkIndex: number, totalSize: number): Promise<number> {
    const start = chunkIndex * this.chunkSize;
    const end = Math.min(start + this.chunkSize - 1, totalSize);

    const chunk = await lastValueFrom(
      this.downloadManagerService.downloadChunk(fileUrl, start, end)
    );
    await this.dbHelper.saveChunk(db, storeName, chunk, `chunk-${chunkIndex}`);
    return chunkIndex;
  }

  private async getMissingChunks(db: IDBDatabase, storeName: string, totalChunks: number): Promise<number[]> {
    const keys = await this.dbHelper.getAllKeys(db, storeName);
    const downloadedChunks = keys.map((key) => parseInt(key.split('-')[1], 10));
    const missingChunks = [];
    for (let i = 0; i < totalChunks; i++) {
      if (!downloadedChunks.includes(i)) {
        missingChunks.push(i);
      }
    }
    return missingChunks;
  }

  private async combineChunks(db: IDBDatabase, storeName: string, totalChunks: number): Promise<void> {
    const chunks: Blob[] = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunk = await this.dbHelper.getChunk(db, storeName, `chunk-${i}`);
      if (chunk) chunks.push(chunk);
    }

    await this.dbHelper.cleanupIndexedDB(db, storeName);

    const fileBlob = new Blob(chunks);
    const url = URL.createObjectURL(fileBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'downloaded-file';
    a.click();
    URL.revokeObjectURL(url);
  }
}
