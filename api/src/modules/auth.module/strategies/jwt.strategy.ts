import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { IJwtPayload } from '../models/jwt-payload.model';
import { User } from '@prisma/client';
import { UsersService } from 'src/modules/users.module/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const user = await this.userService.get(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
