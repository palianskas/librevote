import { Module } from '@nestjs/common';
import { CampaignsController } from 'src/routes/campaigns/campaigns.controller';
import { CampaignCreateHandler } from 'src/routes/campaigns/handlers/campaign-create.handler';
import { CampaignSearchHandler } from 'src/routes/campaigns/handlers/campaign-search.handler';
import { DataModule } from '../data/data.module';
import { CampaignUsersRepository } from './campaign-users/campaign-users.reposittory';
import { CampaignsRepository } from './campaigns.repository';
import { CampaignsService } from './campaigns.service';

@Module({
  imports: [DataModule],
  providers: [
    CampaignsService,
    CampaignsRepository,
    CampaignUsersRepository,
    CampaignCreateHandler,
    CampaignSearchHandler,
  ],
  controllers: [CampaignsController],
})
export class CampaignsModule {}
