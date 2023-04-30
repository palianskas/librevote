import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { User, UserDto } from 'src/app/users.module/models/user.model';
import { ConfigService } from 'src/app/common.module/services/config.service';
import {
  IUsersSearchRequest,
  IUsersSearchResponse,
} from '../models/users-contracts.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private usersApi: IUsersApi;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService
  ) {
    this.usersApi = this.initApi();
  }

  async get(id: string): Promise<User | null> {
    const dto = await this.usersApi.get(id);

    if (!dto) {
      return null;
    }

    const user = User.map(dto);

    return user;
  }

  async search(emails: string[]): Promise<User[]> {
    const request: IUsersSearchRequest = {
      emails: emails,
    };

    const response = await this.usersApi.search(request);

    const users = response.rows.map((row) => User.map(row));

    return users;
  }

  private initApi(): IUsersApi {
    const apiUrl = this.configService.API_URL + 'users/';

    const api: IUsersApi = {
      get: async (id): Promise<UserDto> => {
        const url = apiUrl + id;

        const request = this.httpClient.get<UserDto>(url, {
          observe: 'body',
        });

        return firstValueFrom(request).catch(() => {
          return null;
        });
      },
      search: async (searchRequest) => {
        const url = apiUrl + 'search/';

        const request = this.httpClient.post<IUsersSearchResponse>(
          url,
          searchRequest,
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

interface IUsersApi {
  get(id: string): Promise<UserDto | null>;
  search(request: IUsersSearchRequest): Promise<IUsersSearchResponse>;
}
