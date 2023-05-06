import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<User>(err: any, user: User, info: any): User | null {
    if (!!err || !user || !!info) {
      return null;
    }

    return user;
  }
}
