import { Module } from '@nestjs/common';
import { CampaignCreateHandler } from 'src/modules/campaigns.module/routes/handlers/campaign-create.handler';
import { CampaignSearchHandler } from 'src/modules/campaigns.module/routes/handlers/campaign-search.handler';
import { CoreModule } from '../core.module/core.module';
import { DataModule } from '../data.module/data.module';
import { CampaignPublicLinksRepository } from './campaign-public-links/campaign-public-links.repository';
import { CampaignPublicLinksService } from './campaign-public-links/campaign-public-links.service';
import { CampaignUsersRepository } from './campaign-users/campaign-users.repository';
import { CampaignsRepository } from './campaigns.repository';
import { CampaignsService } from './campaigns.service';
import { CampaignPublicLinksController } from './routes/campaign-public-links.controller';
import { CampaignsController } from './routes/campaigns.controller';
import { CampaignUpdateHandler } from './routes/handlers/campaign-update.handler';

@Module({
  imports: [DataModule, CoreModule],
  providers: [
    CampaignsService,
    CampaignsRepository,
    CampaignUsersRepository,
    CampaignCreateHandler,
    CampaignSearchHandler,
    CampaignUpdateHandler,
    CampaignPublicLinksService,
    CampaignPublicLinksRepository,
  ],
  controllers: [CampaignsController, CampaignPublicLinksController],
})
export class CampaignsModule {}
