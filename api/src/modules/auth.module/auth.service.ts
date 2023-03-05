import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users.module/models/user.dto';
import { UsersService } from '../users.module/users.service';
import { EncryptionService } from './encryption.service';
import { IJwtPayload, IJwtRefreshPayload } from './models/jwt-payload.model';

@Injectable()
export class AuthService {
  static ACCESS_TOKEN_VALIDITY_INTERVAL_SECS = 60 * 60; // 15m
  static REFRESH_TOKEN_VALIDITY_INTERVAL_SECS = 24 * 60 * 60; // 24h

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

  verify<TToken extends object>(token: string): Promise<TToken> {
    return this.jwtService.verifyAsync<TToken>(token);
  }

  generateAccessJwt(
    userId: string,
    validityIntervalSecs: number = AuthService.ACCESS_TOKEN_VALIDITY_INTERVAL_SECS,
  ): Promise<string> {
    const expirationDate = this.generateExpirationDate(validityIntervalSecs);

    const payload: IJwtPayload = {
      sub: userId,
      exp: expirationDate,
    };

    return this.jwtService.signAsync(payload);
  }

  generateRefreshJwt(
    userId: string,
    validityIntervalSecs: number = AuthService.REFRESH_TOKEN_VALIDITY_INTERVAL_SECS,
  ): Promise<string> {
    const expirationDate = this.generateExpirationDate(validityIntervalSecs);

    const payload: IJwtRefreshPayload = {
      sub: userId,
      exp: expirationDate,
      refresh: true,
    };

    return this.jwtService.signAsync(payload);
  }

  private generateExpirationDate(validityIntervalSecs: number): number {
    return Date.now() / 1000 + validityIntervalSecs;
  }
}
