import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexDBHelperService {

  constructor() {
  }

  public readonly DB_NAME = 'RayanDb';
  public readonly DOWNLOAD_STORE_NAME = 'DownloadFileChunk';
  public readonly UPLOAD_STORE_NAME = 'UploadFileChunk';

  async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.DOWNLOAD_STORE_NAME)) {
          db.createObjectStore(this.DOWNLOAD_STORE_NAME);
        }
        if (!db.objectStoreNames.contains(this.UPLOAD_STORE_NAME)) {
          db.createObjectStore(this.UPLOAD_STORE_NAME);
        }
      };

      request.onsuccess = (event: any) => resolve(event.target.result);
      request.onerror = (event: any) => reject(event.target.error);
    });
  }

  async saveChunk(db: IDBDatabase, storeName: string, chunk: Blob, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(chunk, key);

      request.onsuccess = () => resolve();
      request.onerror = (event: any) => reject(event.target.error);
    });
  }

  async getChunk(db: IDBDatabase, storeName: string, key: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event: any) => reject(event.target.error);
    });
  }

  async getAllKeys(db: IDBDatabase, storeName: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAllKeys();

      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = (event: any) => reject(event.target.error);
    });
  }

  async deleteFileChunks(db: IDBDatabase, storeName: string, fileId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.openCursor();

      request.onsuccess = (event: any) => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.key.startsWith(fileId)) {
            cursor.delete();
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = (event: any) => reject(event.target.error);
    });
  }
}
