import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<User>(user: User): User | null {
    if (!user) {
      return null;
    }

    return user;
  }
}
