import { Component, Input, OnInit } from '@angular/core';
import { CampaignCandidatePublic } from 'src/app/campaigns.module/models/campaign-candidates/campaign-candidate-public.model';
import { CampaignPublic } from 'src/app/campaigns.module/models/campaign-public.model';
import { User } from 'src/app/users.module/models/user.model';
import { VotingService } from 'src/app/votes.module/services/voting.service';
import { VotingVoucher } from '../../models/voting-voucher.model';
import { VoteCastError } from '../../models/vote-cast-error.enum';
import { VoteCastResponse } from '../../models/vote-cast-response.model';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
})
export class VotingComponent implements OnInit {
  @Input() campaign: CampaignPublic;
  @Input() voucher?: VotingVoucher;
  @Input() user?: User;

  candidates: CampaignCandidatePublic[];
  selectedCandidate?: CampaignCandidatePublic;

  voteCastResponse: VoteCastResponse;

  constructor(private readonly votingService: VotingService) {}

  ngOnInit(): void {
    this.candidates = this.campaign.candidates.sort(
      (x, y) => x.index - y.index
    );
  }

  async vote() {
    this.voteCastResponse = await this.votingService.castVote(
      this.campaign,
      this.selectedCandidate,
      this.voucher,
      this.user
    );

    this.selectedCandidate = null;
  }

  selectCandidate(candidate: CampaignCandidatePublic): void {
    this.selectedCandidate = candidate;
  }

  resolveErrorMessage(error: VoteCastError): string {
    switch (error) {
      case VoteCastError.SpamDetected:
        return 'Cannot vote multiple times';
      default:
        return "Please try again or contact the campaign's administrator";
    }
  }
}
