import { User } from '@prisma/client';

export interface IAuthenticatedRequest {
  user: User;
}

export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface IRegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface IAccessRefreshRequest {
  refresh_token: string;
}

export interface IAccessRefreshResponse {
  access_token: string;
}
