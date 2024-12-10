import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexDBHelperService {

  constructor() {
  }

  private readonly dbName = 'DownloadDB';

  async openDB(storeName: string): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
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

  async getChunk(db: IDBDatabase, storeName: string, key: string): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
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

  async cleanupIndexedDB(db: IDBDatabase, storeName: string) {
    db.deleteObjectStore(storeName)
    // const transaction = db.transaction(storeName, 'readwrite');
    // const store = transaction.objectStore(storeName);
    // const request = store.clear();
    // request.onsuccess = () => console.log('IndexedDB cleaned up.');
  }
}
