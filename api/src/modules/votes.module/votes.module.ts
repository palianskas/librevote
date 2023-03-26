import { Module } from '@nestjs/common';
import { CampaignsModule } from '../campaigns.module/campaigns.module';
import { VoteCastHandler } from './routes/handlers/vote-cast.handler';
import { VotesController } from './routes/votes.controller';
import { VouchersController } from './routes/vouchers.controller';

@Module({
  imports: [CampaignsModule],
  controllers: [VotesController, VouchersController],
  providers: [VoteCastHandler],
})
export class VotesModule {}
