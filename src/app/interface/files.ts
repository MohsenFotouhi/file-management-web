export class file {
    CreateDate!: string;
  FileName!: string;
  FarsiName!: string;
    FileSize!: string;
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


export class fileBlob {
    file!: file;
    content!: string;
}
