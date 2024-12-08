import { Injectable } from '@angular/core';
import { BehaviorSubject, from, lastValueFrom, mergeMap } from 'rxjs';
import { IndexDBHelperService } from './index-db-helper.service';
import { DownloadManagerService } from './download-manager.service';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {
  private chunkSize = 256 * 1024; // 1MB
  private maxConcurrency = 4;
  public progress$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

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
            this.downloadAndSaveChunk(db, fileUrl, chunkIndex, totalSize).then(() => {
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
        error: (err) => console.error('Error downloading chunk:', err),
        complete: async () => {
          console.log('All chunks downloaded.');
          await this.combineChunks(db, totalChunks);
          this.progress$.next(100);
        }
      });
  }

  private async downloadAndSaveChunk(db: IDBDatabase, fileUrl: string, chunkIndex: number, totalSize:number): Promise<number> {
    const start = chunkIndex * this.chunkSize;
    const end = Math.min(start + this.chunkSize - 1, totalSize);

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

    await this.cleanupIndexedDB(db);

    const fileBlob = new Blob(chunks);
    const url = URL.createObjectURL(fileBlob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'downloaded-file';
    a.click();
    URL.revokeObjectURL(url);
  }

  private async cleanupIndexedDB(db: IDBDatabase) {
    const transaction = db.transaction(this.dbHelper.storeName, 'readwrite');
    const store = transaction.objectStore(this.dbHelper.storeName);

    const request = store.clear();
    request.onsuccess = () => console.log('IndexedDB cleaned up.');
  }

  //async getFileSize(fileUrl: string): Promise<number> {
  //  // const response = await fetch(fileUrl, { method: 'HEAD' });
  //  // return parseInt(response.headers.get('content-length') || '0', 10);
  //  return 2102720520 - 1;
  //}
}
