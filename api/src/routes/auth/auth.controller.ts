import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
} from '@nestjs/common';
import { CredentialsAuthGuard } from 'src/services/auth/guards/credentials-auth.guard';
import {
  WithCredentials,
  Public,
} from 'src/services/auth/guards/guard-activators.decorator';
import { UserDto } from 'src/services/users/models/user.dto';
import { LoginHandler } from './handlers/login.handler';
import { RegisterHandler } from './handlers/register.handler';
import { ICurrentUserRequest } from './models/current-request.model';
import { ILoginRequest } from './models/login-request.model';
import { ILoginResponse } from './models/login-response.model';
import { IRegisterRequest } from './models/register-request.model';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginHandler: LoginHandler,
    private readonly registerHandler: RegisterHandler,
  ) {}

  @Get()
  current(@Request() request: ICurrentUserRequest): UserDto {
    const dto = UserDto.map(request.user);

    return dto;
  }

  @Post('login')
  @WithCredentials()
  @UseGuards(CredentialsAuthGuard)
  login(@Request() request: ILoginRequest): Promise<ILoginResponse> {
    return this.loginHandler.handle(request);
  }

  @Post('register')
  @Public()
  register(@Body() request: IRegisterRequest): Promise<UserDto> {
    return this.registerHandler.handle(request);
  }
}
