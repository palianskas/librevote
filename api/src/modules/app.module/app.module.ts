import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { StatusController } from 'src/modules/core.module/routes/status/status.controller';
import { AuthModule } from '../auth.module/auth.module';
import { JwtAuthGuard } from '../auth.module/guards/jwt-auth.guard';
import { CampaignsModule } from '../campaigns.module/campaigns.module';
import { CoreModule } from '../core.module/core.module';
import { StatusService } from '../core.module/status/status.service';
import { DataModule } from '../data.module/data.module';
import { UsersModule } from '../users.module/users.module';

@Module({
  imports: [CoreModule, AuthModule, UsersModule, DataModule, CampaignsModule],
  controllers: [StatusController],
  providers: [
    StatusService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
