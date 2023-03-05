import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/modules/auth.module/auth.service';
import { AuthError } from 'src/modules/auth.module/models/auth-errors.enum';
import { IJwtRefreshPayload } from 'src/modules/auth.module/models/jwt-payload.model';
import {
  IAccessRefreshRequest,
  IAccessRefreshResponse,
} from '../models/auth-contracts.model';

@Injectable()
export class AccessRefreshHandler {
  constructor(private readonly authService: AuthService) {}

  async handle(
    request: IAccessRefreshRequest,
  ): Promise<IAccessRefreshResponse> {
    let refreshToken: IJwtRefreshPayload;

    try {
      refreshToken = await this.authService.verify<IJwtRefreshPayload>(
        request.refresh_token,
      );
    } catch (error) {
      throw new UnauthorizedException(AuthError.RefreshTokenInvalid);
    }

    if (!refreshToken.refresh) {
      throw new UnauthorizedException(AuthError.RefreshTokenInvalid);
    }

    const currentUnixTimestamp = Date.now() / 1000;
    if (refreshToken.exp <= currentUnixTimestamp) {
      throw new UnauthorizedException(AuthError.RefreshTokenExpired);
    }

    const accessToken = await this.authService.generateAccessJwt(
      refreshToken.sub,
    );

    const response: IAccessRefreshResponse = {
      access_token: accessToken,
    };

    return response;
  }
}
