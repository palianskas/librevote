import { Module } from '@nestjs/common';
import { CampaignsModule } from '../campaigns.module/campaigns.module';
import { DataModule } from '../data.module/data.module';
import { VoteCastHandler } from './routes/handlers/vote-cast.handler';
import { VotesController } from './routes/votes.controller';
import { VouchersController } from './routes/vouchers.controller';
import { VotesRepository } from './votes.repository';
import { VotesService } from './votes.service';

@Module({
  imports: [CampaignsModule, DataModule],
  controllers: [VotesController, VouchersController],
  providers: [VotesService, VotesRepository, VoteCastHandler],
})
export class VotesModule {}
