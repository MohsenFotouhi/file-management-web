export class File {
  fileName!: string;
  virtualPath!: string;
  fileSize!: string;
  modifiedDate!: string;
  createDate!: string;
  uniqueProperty!: string;
  downloadId!: string;
  fileId!: string;
  canDownLoad!: boolean;
  canView!: boolean;
  canShare!: boolean;
  isPrivate!: boolean;
  checkSum!: string;
  viewCount!: number;
  shareCount!: number;
  downLoadCount!: number;
  farsiName!: string;
  fileSizeInDisk!: string;
  realFileSize!: number;
  parentDirectoryId!: string
}

export class Folder {
  folderName!: string;
  virtualPath!: string;
  modifiedDate!: string;
  createDate!: string;
  uniqueProperty!: string;
  fileId!: string;
  canDownLoad!: boolean;
  canView!: boolean;
  canShare!: boolean;
  isPrivate!: boolean;
  checkSum!: string;
  viewCount!: number;
  shareCount!: number;
  downLoadCount!: number;
  farsiName!: string;
  parentDirectoryId!: string;
}

export class FileBlob {
  file!: File;
  content!: string;
}
