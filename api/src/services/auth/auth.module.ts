import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { CredentialsStrategy } from './strategies/credentials.strategy';
import { DataModule } from '../data/data.module';
import { AuthController } from 'src/routes/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt/dist';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EncryptionService } from './encryption.service';
import { RegisterHandler } from 'src/routes/auth/handlers/register.handler';
import { LoginHandler } from 'src/routes/auth/handlers/login.handler';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    DataModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    CredentialsStrategy,
    JwtStrategy,
    EncryptionService,
    RegisterHandler,
    LoginHandler,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
