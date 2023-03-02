import { Module } from '@nestjs/common';
import { CampaignsController } from 'src/routes/campaigns/campaigns.controller';
import { DataModule } from '../data/data.module';
import { CampaignsRepository } from './campaigns.repository';
import { CampaignsService } from './campaigns.service';

@Module({
  imports: [DataModule],
  providers: [CampaignsService, CampaignsRepository],
  controllers: [CampaignsController],
})
export class CampaignsModule {}
