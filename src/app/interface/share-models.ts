export interface CreateDownloadLinkCommand {
  expireDateTime: Date | null;
  isPermanent: boolean;
  isPublic: boolean;
  shareWithUsers: User[];
  shareWithEmails: string[];
  virtualPath: string;
  FileID: string;
}

export interface User {
  userId: string;
  username: string;
}

export interface PublicModel {
  id: string;
  name: string;
}
