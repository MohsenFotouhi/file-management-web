export interface  ShareModels {
    expireDateTime: Date;
    isPermanent: boolean ;
    isPublic: boolean ;
    resourceId: string;
    users: User[];
    emails : string[]
}

export interface User {
    userId: string;
    username: string;
}