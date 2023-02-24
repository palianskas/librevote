export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  refresh_token: string;
  access_token: string;
}

export interface ITokenRefreshRequest {
  refresh_token: string;
}

export interface ITokenRefreshResponse {
  access_token: string;
}
