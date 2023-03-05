import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/services/auth.module/auth.service';
import {
  IAuthenticatedRequest,
  ILoginResponse,
} from '../models/auth-contracts.model';

@Injectable()
export class LoginHandler {
  constructor(private readonly authService: AuthService) {}

  async handle(request: IAuthenticatedRequest): Promise<ILoginResponse> {
    const accessToken = await this.authService.generateAccessJwt(
      request.user.id,
    );
    const refreshToken = await this.authService.generateRefreshJwt(
      request.user.id,
    );

    const response: ILoginResponse = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };

    return response;
  }
}
