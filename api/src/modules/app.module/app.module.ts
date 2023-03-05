import { Module, Scope } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { StatusController } from 'src/modules/core.module/routes/status/status.controller';
import { AuthModule } from '../auth.module/auth.module';
import { JwtAuthGuard } from '../auth.module/guards/jwt-auth.guard';
import { CampaignsModule } from '../campaigns.module/campaigns.module';
import { CoreModule } from '../core.module/core.module';
import { OperationalContextInterceptor } from '../core.module/operational-context/operational-context.interceptor';
import { OperationalContextService } from '../core.module/operational-context/operational-context.service';
import { StatusService } from '../core.module/status/status.service';
import { DataModule } from '../data.module/data.module';
import { UsersModule } from '../users.module/users.module';

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
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: OperationalContextInterceptor,
    },
  ],
})
export class AppModule {}
