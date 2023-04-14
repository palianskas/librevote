import { Module } from '@nestjs/common';
import { CampaignCreateHandler } from 'src/modules/campaigns.module/routes/handlers/campaign-create.handler';
import { CampaignSearchHandler } from 'src/modules/campaigns.module/routes/handlers/campaign-search.handler';
import { CoreModule } from '../core.module/core.module';
import { DataModule } from '../data.module/data.module';
import { CampaignCandidatesRepository } from './campaign-candidates/campaign-candidates.repository';
import { CampaignCandidatesService } from './campaign-candidates/campaign-candidates.service';
import { CampaignPublicLinksRepository } from './campaign-public-links/campaign-public-links.repository';
import { CampaignPublicLinksService } from './campaign-public-links/campaign-public-links.service';
import { CampaignUsersRepository } from './campaign-users/campaign-users.repository';
import { CampaignsRepository } from './campaigns.repository';
import { CampaignsService } from './campaigns.service';
import { CampaignCandidatesController } from './routes/campaign-candidates.controller';
import { CampaignPublicLinksController } from './routes/campaign-public-links.controller';
import { CampaignsController } from './routes/campaigns.controller';
import { CampaignUpdateHandler } from './routes/handlers/campaign-update.handler';
import { CampaignVotingControlHandler } from './routes/handlers/campaign-voting-control.handler';
import { CampaignResultsController } from './routes/campaign-results.controller';
import { CampaignResultsService } from './campaign-results/campaign-results.service';
import { CampaignResultsRepository } from './campaign-results/campaign-results.repository';

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
    CampaignCandidatesRepository,
    CampaignCandidatesService,
    CampaignVotingControlHandler,
    CampaignResultsService,
    CampaignResultsRepository,
  ],
  controllers: [
    CampaignsController,
    CampaignPublicLinksController,
    CampaignCandidatesController,
    CampaignResultsController,
  ],
  exports: [CampaignsService],
})
export class CampaignsModule {}
