import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VotesService } from './services/votes.service';
import { VotingVouchersService } from './services/vouchers.service';
import { VotingComponent } from './components/voting.component/voting.component';
import { VoteProcessingService } from './services/vote-processing.service';

@NgModule({
  declarations: [VotingComponent],
  providers: [VotesService, VotingVouchersService, VoteProcessingService],
  imports: [CommonModule],
  exports: [VotingComponent],
})
export class VotesModule {}
