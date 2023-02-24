import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from 'src/app/common.module/services/config.service';
import {
  ILoginRequest,
  ILoginResponse,
  ITokenRefreshRequest,
  ITokenRefreshResponse,
} from '../models/auth-contracts.model';
import { User, UserDto } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _AUTH_TOKEN_LOCAL_STORAGE_KEY = 'ACCESS_TOKEN';
  private _USER_LOCAL_STORAGE_KEY = 'USER';

  private authApi: IAuthApi;
  private _user: User;

  public get user(): User {
    return this._user;
  }

  constructor(
    private readonly configService: ConfigService,
    private readonly httpClient: HttpClient
  ) {
    this.authApi = this.initApi();

    this.init();
  }

  async init(): Promise<void> {
    await this.refetchCurrentUser();
  }

  async register(
    email: string,
    name: string,
    password: string
  ): Promise<UserDto> {
    const dto = {
      email: email,
      name: name,
      password: password,
    };

    const response = this.authApi.register(dto);

    return response;
  }

  async login(email: string, password: string): Promise<any> {
    const dto: ILoginRequest = {
      email: email,
      password: password,
    };

    const response = await this.authApi.login(dto);

    this.refresh_token = response.refresh_token;
    this.access_token = response.access_token;

    return response;
  }

  async refetchCurrentUser(): Promise<User> {
    const dto = await this.authApi.current();

    const user = User.map(dto);

    this._user = user;

    return user;
  }

  async refreshAccess(): Promise<void> {
    const refreshToken = localStorage.getItem(
      this.configService.REFRESH_TOKEN_LOCAL_STORAGE_KEY
    );

    if (!this.refresh_token) {
      return;
    }

    const dto: ITokenRefreshRequest = {
      refresh_token: this.refresh_token,
    };

    const response = await this.authApi.refreshAccess(dto);

    this.access_token = response.access_token;
  }

  private get access_token(): string {
    const token = localStorage.getItem(
      this.configService.ACCESS_TOKEN_LOCAL_STORAGE_KEY
    );

    return token;
  }

  private set access_token(token: string) {
    localStorage.setItem(
      this.configService.ACCESS_TOKEN_LOCAL_STORAGE_KEY,
      token
    );
  }

  private get refresh_token(): string {
    const token = localStorage.getItem(
      this.configService.REFRESH_TOKEN_LOCAL_STORAGE_KEY
    );

    return token;
  }

  private set refresh_token(token: string) {
    localStorage.setItem(
      this.configService.REFRESH_TOKEN_LOCAL_STORAGE_KEY,
      token
    );
  }

  private initApi(): IAuthApi {
    const apiUrl = this.configService.API_URL + 'auth/';

    const api: IAuthApi = {
      register: async (dto) => {
        const request = this.httpClient.post<UserDto>(
          apiUrl + 'register',
          dto,
          {
            observe: 'body',
          }
        );

        return firstValueFrom(request);
      },
      login: async (dto) => {
        const request = this.httpClient.post<ILoginResponse>(
          apiUrl + 'login',
          dto,
          {
            observe: 'body',
          }
        );

        return firstValueFrom(request);
      },
      current: async () => {
        const request = this.httpClient.get<UserDto>(apiUrl, {
          observe: 'body',
        });

        return firstValueFrom(request);
      },
      refreshAccess: async (dto) => {
        const request = this.httpClient.post<ITokenRefreshResponse>(
          apiUrl + 'access',
          dto,
          {
            observe: 'body',
          }
        );

        return firstValueFrom(request);
      },
    };

    return api;
  }
}

interface IAuthApi {
  register(dto: UserDto): Promise<UserDto>;
  login(dto: ILoginRequest): Promise<ILoginResponse>;
  current(): Promise<UserDto>;
  refreshAccess(dto: ITokenRefreshRequest): Promise<ITokenRefreshResponse>;
}
