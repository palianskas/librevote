import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import { ILoginRequest } from '../models/login-request.model';
import { ILoginResponse } from '../models/login-response.model';

@Injectable()
export class LoginHandler {
  constructor(private readonly authService: AuthService) {}

  async handle(request: ILoginRequest): Promise<ILoginResponse> {
    const token = await this.authService.generateJwt(request.user);

    const response: ILoginResponse = {
      access_token: token,
    };

    return response;
  }
}
