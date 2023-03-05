import { Module, Scope } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { StatusController } from 'src/routes/status/status.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { CoreModule } from '../core/core.module';
import { OperationalContextInterceptor } from '../core/operational-context/operational-context.interceptor';
import { OperationalContextService } from '../core/operational-context/operational-context.service';
import { StatusService } from '../core/status/status.service';
import { DataModule } from '../data/data.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CoreModule, AuthModule, UsersModule, DataModule, CampaignsModule],
  controllers: [StatusController],
  providers: [
    StatusService,
    OperationalContextService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
