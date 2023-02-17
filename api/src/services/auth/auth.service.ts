import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserDto } from '../users/models/user.dto';
import { UsersService } from '../users/users.service';
import { EncryptionService } from './encryption.service';
import { IJwtPayload } from './models/jwt-payload.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async validate(username: string, password: string): Promise<UserDto | null> {
    const user = await this.usersService.getByEmail(username);

    if (!user) {
      return null;
    }

    const result = await this.encryptionService.compare(
      password,
      user.password,
    );

    if (result) {
      return UserDto.map(user);
    }

    return null;
  }

  generateJwt(user: User): Promise<string> {
    const payload: IJwtPayload = {
      username: user.email,
      sub: user.id,
    };

    return this.jwtService.signAsync(payload);
  }
}
