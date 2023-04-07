import { Component, Input } from '@angular/core';
import { CampaignCandidatePublic } from 'src/app/campaigns.module/models/campaign-candidates/campaign-candidate-public.model';
import { CampaignPublic } from 'src/app/campaigns.module/models/campaign-public.model';
import { User } from 'src/app/users.module/models/user.model';
import { VotingService } from 'src/app/votes.module/services/voting.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
})
export class VotingComponent {
  @Input() campaign: CampaignPublic;
  @Input() voucherId?: string;
  @Input() user?: User;

  selectedCandidate?: CampaignCandidatePublic;

  isVoteCastDone = false;
  isVoteCastSuccessful = false;

  constructor(private readonly votingService: VotingService) {}

  async vote() {
    try {
      const response = await this.votingService.castVote(
        this.campaign,
        this.selectedCandidate,
        this.voucherId,
        this.user
      );
      this.isVoteCastSuccessful = !!response;
    } catch {
      this.isVoteCastSuccessful = false;
    } finally {
      this.selectedCandidate = null;
      this.isVoteCastDone = true;
    }
  }

  selectCandidate(candidate: CampaignCandidatePublic): void {
    this.selectedCandidate = candidate;
  }
}
