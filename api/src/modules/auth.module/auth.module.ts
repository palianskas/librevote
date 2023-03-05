import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { CredentialsStrategy } from './strategies/credentials.strategy';
import { JwtModule } from '@nestjs/jwt/dist';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EncryptionService } from './encryption.service';
import { RegisterHandler } from 'src/modules/auth.module/routes/handlers/register.handler';
import { LoginHandler } from 'src/modules/auth.module/routes/handlers/login.handler';
import { AccessRefreshHandler } from 'src/modules/auth.module/routes/handlers/access-refresh.handler';
import { UsersModule } from '../users.module/users.module';
import { DataModule } from '../data.module/data.module';
import { AuthController } from './routes/auth.controller';

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
