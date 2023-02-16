import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from 'src/services/auth/auth.service';
import { CredentialsAuthGuard } from 'src/services/auth/guards/credentials-auth.guard';
import { JwtAuthGuard } from 'src/services/auth/guards/jwt-auth.guard';
import {
  WithCredentials,
  Public,
} from 'src/services/auth/guards/guard-activators.decorator';
import { UserDto } from 'src/services/users/models/user.dto';
import { ICurrentUserRequest } from './models/current-request.model';
import { ILoginRequest } from './models/login-request.model';
import { ILoginResponse } from './models/login-response.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  current(@Request() request: ICurrentUserRequest): UserDto {
    const dto = UserDto.map(request.user);

    return dto;
  }

  @Post('login')
  @WithCredentials()
  @UseGuards(CredentialsAuthGuard)
  async login(@Request() request: ILoginRequest): Promise<ILoginResponse> {
    const token = await this.authService.generateJwt(request.user);

    const response: ILoginResponse = {
      access_token: token,
    };

    return response;
  }

  @Post('register')
  @Public()
  async register() {
    console.log('register');
    // TODO: implement
  }
}
