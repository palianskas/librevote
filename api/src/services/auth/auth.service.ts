import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/models/user.dto';
import { UsersService } from '../users/users.service';
import { IJwtPayload } from './models/jwt-payload.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validate(username: string, password: string): Promise<UserDto | null> {
    const user = await this.usersService.getByEmail(username);

    if (user?.password === password) {
      return UserDto.map(user);
    }

    return null;
  }

  generateJwt(user: UserDto): Promise<string> {
    const payload: IJwtPayload = {
      username: user.email,
      sub: user.id,
    };

    return this.jwtService.signAsync(payload);
  }
}
