export class file {
    CreateDate!: string;
    FileName!: string;
    FileSize!: string;
    ModifiedDate!: string;
    VirtualPath!: string;
}


export class folder {
    CreateDate!: string;
    FolderName!: string;
    ModifiedDate!: string;
    VirtualPath!: string;
}


export class fileBlob {
    file!: file;
    content!: string;
}