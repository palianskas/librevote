import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<User>(err: any, user: User, info: Error): User | null {
    if (!user) {
      return null;
    }

    return user;
  }
}
