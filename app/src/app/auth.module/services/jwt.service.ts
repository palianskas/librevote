import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, Subject } from 'rxjs';
import { ConfigService } from 'src/app/common.module/services/config.service';
import {
  ITokenRefreshRequest,
  ITokenRefreshResponse,
} from '../models/auth-contracts.model';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private jwtApi: IJwtApi;

  constructor(private readonly configService: ConfigService) {
    this.jwtApi = this.initApi();
  }

  async refreshAccess(): Promise<void> {
    if (!this.refresh_token) {
      return;
    }

    const dto: ITokenRefreshRequest = {
      refresh_token: this.refresh_token,
    };

    let response: ITokenRefreshResponse;
    try {
      response = await this.jwtApi.refreshAccess(dto);
    } catch {
      return;
    }

    this.access_token = response.access_token;
  }

  clear(): void {
    localStorage.removeItem(this.configService.ACCESS_TOKEN_LOCAL_STORAGE_KEY);
    localStorage.removeItem(this.configService.REFRESH_TOKEN_LOCAL_STORAGE_KEY);
  }

  public get access_token(): string {
    const token = localStorage.getItem(
      this.configService.ACCESS_TOKEN_LOCAL_STORAGE_KEY
    );

    return token;
  }

  public set access_token(token: string) {
    localStorage.setItem(
      this.configService.ACCESS_TOKEN_LOCAL_STORAGE_KEY,
      token
    );
  }

  public get refresh_token(): string {
    const token = localStorage.getItem(
      this.configService.REFRESH_TOKEN_LOCAL_STORAGE_KEY
    );

    return token;
  }

  public set refresh_token(token: string) {
    localStorage.setItem(
      this.configService.REFRESH_TOKEN_LOCAL_STORAGE_KEY,
      token
    );
  }

  private initApi(): IJwtApi {
    const apiUrl = this.configService.API_URL + 'auth/';

    // using `fetch` to remove dependency on angular's `HttpClient`
    // this allows `JwtAccessInterceptor` to inject `JwtService` w/o circular deps
    const api: IJwtApi = {
      refreshAccess: async (dto) => {
        const response = (await (
          await fetch(apiUrl + 'access', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dto),
          })
        ).json()) as ITokenRefreshResponse;

        return response;
      },
    };

    return api;
  }
}

interface IJwtApi {
  refreshAccess(dto: ITokenRefreshRequest): Promise<ITokenRefreshResponse>;
}
