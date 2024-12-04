export class File {
  CreateDate!: string;
  FileName!: string;
  FarsiName!: string;
  FileSize!: string;
  FileSizeInDisk!: string;
  RealFileSize!: number;
  ModifiedDate!: string;
  VirtualPath!: string;
  DownloadId!: string;
  FileId!: string;
  CheckSum!: string;
  ViewCount!: number;
  ShareCount!: number;
  DownLoadCount!: number;
  CanDownLoad!: boolean;
  CanView!: boolean;
  CanShare!: boolean;
  IsPrivate!: boolean;
}


export class Folder {
  CreateDate!: string;
  FolderName!: string;
  FarsiName!: string;
  ModifiedDate!: string;
  VirtualPath!: string;
  DownloadId!: string;
  FileId!: string;
  CheckSum!: string;
  ViewCount!: number;
  ShareCount!: number;
  DownLoadCount!: number;

  CanDownLoad!: boolean;
  CanView!: boolean;
  CanShare!: boolean;
  IsPrivate!: boolean;
}


export class FileBlob {
  file!: File;
  content!: string;
}
