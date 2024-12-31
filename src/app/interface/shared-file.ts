export interface SharedFile {
    isPermanent: boolean;
    isPublic: boolean;
    createDate: string;
    expireDate: string;
    virtualPath: string;
    fileName: string;
    shareWithEmails: string[];
    shareWithUsers: User[];
}


export interface User {
    userId: string;
    username: string;
}