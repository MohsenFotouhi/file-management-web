export interface LoginModel {
    username: string,
    password: string
}

export interface LoginResponse {
  token: string,
  userInfo: User;
}


export interface User {
  userGUID: string,
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNo: string

}
