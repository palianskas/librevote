import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VotesService } from './services/votes.service';
import { VotingVouchersService } from './services/vouchers.service';
import { VotingComponent } from './components/voting.component/voting.component';
import { VoteProcessingService } from './services/vote-processing.service';
import { VotingInvitesViewComponent } from './components/voting-invites-view.component/voting-invites-view.component';

@NgModule({
  declarations: [VotingComponent, VotingInvitesViewComponent],
  providers: [VotesService, VotingVouchersService, VoteProcessingService],
  imports: [CommonModule],
  exports: [VotingComponent, VotingInvitesViewComponent],
})
export class VotesModule {}
