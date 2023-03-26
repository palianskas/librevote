import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';
import { AuthError } from '../models/auth-errors.enum';
import {
  IS_CREDENTIALS_KEY,
  IS_OPTIONAL_JWT,
  IS_PUBLIC_KEY,
} from './guard-activators.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest<User>(err: any, user: User, info: Error): User {
    if (!!err || !!info) {
      const message =
        info instanceof TokenExpiredError
          ? AuthError.AccessTokenExpired
          : AuthError.AccessTokenInvalid;

      throw new UnauthorizedException(message);
    }

    return user;
  }

  canActivate(context: ExecutionContext) {
    const isPublicEndpoint = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    const isCredentialsEndpoint = this.reflector.getAllAndOverride<boolean>(
      IS_CREDENTIALS_KEY,
      [context.getHandler(), context.getClass()],
    );
    const isOptionalJwtEndpoint = this.reflector.getAllAndOverride<boolean>(
      IS_OPTIONAL_JWT,
      [context.getHandler(), context.getClass()],
    );

    if (isPublicEndpoint || isCredentialsEndpoint || isOptionalJwtEndpoint) {
      return true;
    }

    return super.canActivate(context);
  }
}
