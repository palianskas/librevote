import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import {
  IS_CREDENTIALS_KEY,
  IS_PUBLIC_KEY,
} from './guard-activators.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
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

    if (isPublicEndpoint || isCredentialsEndpoint) {
      return true;
    }

    return super.canActivate(context);
  }
}
