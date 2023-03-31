import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VotesService } from './services/votes.service';
import { VotingVouchersService } from './services/vouchers.service';

@NgModule({
  declarations: [],
  providers: [VotesService, VotingVouchersService],
  imports: [CommonModule],
})
export class VotesModule {}
