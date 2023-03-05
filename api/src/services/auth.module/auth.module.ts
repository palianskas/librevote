import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { CredentialsStrategy } from './strategies/credentials.strategy';
import { AuthController } from 'src/routes/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt/dist';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EncryptionService } from './encryption.service';
import { RegisterHandler } from 'src/routes/auth/handlers/register.handler';
import { LoginHandler } from 'src/routes/auth/handlers/login.handler';
import { AccessRefreshHandler } from 'src/routes/auth/handlers/access-refresh.handler';
import { UsersModule } from '../users.module/users.module';
import { DataModule } from '../data.module/data.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    DataModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  providers: [
    AuthService,
    CredentialsStrategy,
    JwtStrategy,
    EncryptionService,
    RegisterHandler,
    LoginHandler,
    AccessRefreshHandler,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
