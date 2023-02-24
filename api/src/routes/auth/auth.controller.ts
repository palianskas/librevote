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
import { AccessRefreshHandler } from './handlers/access-refresh.handler';
import { LoginHandler } from './handlers/login.handler';
import { RegisterHandler } from './handlers/register.handler';
import {
  IAccessRefreshRequest,
  IAccessRefreshResponse,
  IAuthenticatedRequest,
  ILoginResponse,
  IRegisterRequest,
} from './models/auth-contracts.model';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginHandler: LoginHandler,
    private readonly registerHandler: RegisterHandler,
    private readonly accessRefreshHandler: AccessRefreshHandler,
  ) {}

  @Get()
  current(@Request() request: IAuthenticatedRequest): UserDto {
    const dto = UserDto.map(request.user);

    return dto;
  }

  @Post('login')
  @WithCredentials()
  @UseGuards(CredentialsAuthGuard)
  login(@Request() request: IAuthenticatedRequest): Promise<ILoginResponse> {
    return this.loginHandler.handle(request);
  }

  @Post('register')
  @Public()
  register(@Body() request: IRegisterRequest): Promise<UserDto> {
    return this.registerHandler.handle(request);
  }

  @Post('access')
  @Public()
  refreshAccess(
    @Body() request: IAccessRefreshRequest,
  ): Promise<IAccessRefreshResponse> {
    return this.accessRefreshHandler.handle(request);
  }
}
