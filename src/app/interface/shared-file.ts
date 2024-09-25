export interface SharedFile {
    IsPermanent: boolean;
    IsPublic: boolean;
    CreateDate: string;
    ExpireDate: string;
    VirtualPath: string;
    FileName: string;
    ShareWithEmails: string[];
    ShareWithUsers: User[];
}


export interface User {
    userId: string;
    username: string;
}