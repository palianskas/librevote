import { Module } from '@nestjs/common';
import { CampaignCreateHandler } from 'src/modules/campaigns.module/routes/handlers/campaign-create.handler';
import { CampaignSearchHandler } from 'src/modules/campaigns.module/routes/handlers/campaign-search.handler';
import { CoreModule } from '../core.module/core.module';
import { DataModule } from '../data.module/data.module';
import { CampaignUsersRepository } from './campaign-users/campaign-users.repository';
import { CampaignsRepository } from './campaigns.repository';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './routes/campaigns.controller';

@Module({
  imports: [DataModule, CoreModule],
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
