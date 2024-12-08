export class File {
  FileName!: string;
  VirtualPath!: string;
  FileSize!: string;
  ModifiedDate!: string;
  CreateDate!: string;
  UniqueProperty!: string;
  DownloadId!: string;
  FileId!: string;
  CanDownLoad!: boolean;
  CanView!: boolean;
  CanShare!: boolean;
  IsPrivate!: boolean;
  CheckSum!: string;
  ViewCount!: number;
  ShareCount!: number;
  DownLoadCount!: number;
  FarsiName!: string;
  FileSizeInDisk!: string;
  RealFileSize!: number;
  ParentDirectoryId!: string
}

export class Folder {
  FolderName!: string;
  VirtualPath!: string;
  ModifiedDate!: string;
  CreateDate!: string;
  UniqueProperty!: string;
  FileId!: string;
  CanDownLoad!: boolean;
  CanView!: boolean;
  CanShare!: boolean;
  IsPrivate!: boolean;
  CheckSum!: string;
  ViewCount!: number;
  ShareCount!: number;
  DownLoadCount!: number;
  FarsiName!: string;
  ParentDirectoryId!: string;
}

export class FileBlob {
  file!: File;
  content!: string;
}
