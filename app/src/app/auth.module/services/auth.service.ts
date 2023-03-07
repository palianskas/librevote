import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, Subject } from 'rxjs';
import { RouteNames } from 'src/app/app.module/app.routes';
import { ConfigService } from 'src/app/common.module/services/config.service';
import { ILoginRequest, ILoginResponse } from '../models/auth-contracts.model';
import { User, UserDto } from '../models/user.model';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authApi: IAuthApi;
  private _user: User;
  private _userSubject: Subject<User | null>;

  public get userObservable(): Subject<User | null> {
    return this._userSubject;
  }

  public async getUser(): Promise<User> {
    if (!!this._user) {
      return this._user;
    }

    const user = await this.fetchCurrentUser();

    return user;
  }

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly httpClient: HttpClient,
    private readonly router: Router
  ) {
    this.authApi = this.initApi();

    this.init();
  }

  async init(): Promise<void> {
    this._userSubject = new Subject<User | null>();

    this.userObservable.subscribe((user) => {
      this._user = user;
    });

    await this.fetchCurrentUser();
  }

  async register(email: string, name: string, password: string): Promise<void> {
    const dto = {
      email: email,
      name: name,
      password: password,
    };

    await this.authApi.register(dto);

    await this.login(email, password);
  }

  async login(email: string, password: string): Promise<void> {
    const dto: ILoginRequest = {
      email: email,
      password: password,
    };

    const response = await this.authApi.login(dto);

    this.jwtService.refresh_token = response.refresh_token;
    this.jwtService.access_token = response.access_token;

    this.fetchCurrentUser();

    this.router.navigate([RouteNames.index]);
  }

  async fetchCurrentUser(retryNo = 0): Promise<User | null> {
    if (!this.jwtService.access_token) {
      return null;
    }

    let dto: UserDto;

    try {
      dto = await this.authApi.current();
    } catch {
      await this.jwtService.refreshAccess();

      if (retryNo < 2) {
        return await this.fetchCurrentUser(retryNo + 1);
      }

      return null;
    }

    const user = this.updateCurrentUser(dto);

    return user;
  }

  private updateCurrentUser(dto: UserDto): User {
    const user = User.map(dto);

    this._user = user;
    this._userSubject.next(user);

    return user;
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
    };

    return api;
  }
}

interface IAuthApi {
  register(dto: UserDto): Promise<UserDto>;
  login(dto: ILoginRequest): Promise<ILoginResponse>;
  current(): Promise<UserDto>;
}
