import { Module } from '@nestjs/common';
import { CampaignsModule } from '../campaigns.module/campaigns.module';
import { DataModule } from '../data.module/data.module';
import { UsersModule } from '../users.module/users.module';
import { VoteCastHandler } from './routes/handlers/vote-cast.handler';
import { VoucherCreateHandler } from './routes/handlers/voucher-create.handler';
import { VotesController } from './routes/votes.controller';
import { VouchersController } from './routes/vouchers.controller';
import { VotesRepository } from './votes.repository';
import { VotesService } from './votes.service';
import { VouchersRepository } from './vouchers.repository';
import { VouchersService } from './vouchers.service';

@Module({
  imports: [CampaignsModule, DataModule, UsersModule],
  controllers: [VotesController, VouchersController],
  providers: [
    VotesService,
    VotesRepository,
    VoteCastHandler,
    VouchersService,
    VouchersRepository,
    VoucherCreateHandler,
  ],
})
export class VotesModule {}
