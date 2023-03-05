import { Module } from '@nestjs/common';
import { StatusController } from '../../routes/status/status.controller';
import { StatusService } from './status/status.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { DataModule } from '../data/data.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CampaignsModule } from '../campaigns/campaigns.module';

@Module({
  imports: [AuthModule, UsersModule, DataModule, CampaignsModule],
  controllers: [StatusController],
  providers: [
    StatusService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class CoreModule {}
