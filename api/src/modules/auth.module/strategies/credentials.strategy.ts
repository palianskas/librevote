import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserDto } from 'src/modules/users.module/models/user.dto';

@Injectable()
export class CredentialsStrategy extends PassportStrategy(
  Strategy,
  'credentials',
) {
  constructor(private authService: AuthService) {
    const config = {
      usernameField: 'email',
      passwordField: 'password',
    };

    super(config);
  }

  async validate(username: string, password: string): Promise<UserDto> {
    const user = await this.authService.validate(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
