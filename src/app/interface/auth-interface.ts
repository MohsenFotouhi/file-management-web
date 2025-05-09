export interface LoginModel {
  username: string;
  password: string;
}

export interface LoginResponse {
  refreshToken: string;
  token: string;
  userInfo: User;
}

export interface User {
  userGUID: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
}

export interface Storage {
  maxUserStorage: number;
  maxCountFile: number;
  maxCountFolder: number;
}

export interface CreateUserSetting {
  id?: string;
  uploadSetting?: string;
  downLoadSetting?: string;
  shareSetting?: string;
  securitySetting?: string;
  storageSetting?: any;
  recycleBinSetting?: any;
  groupId?: string;
}

export interface RecycleBin {
  userCanPhysicalDelete?: boolean;
  userCanRestore?: boolean;
  adminAllowDelete?: boolean;
}
