import { Component, Input, OnInit } from '@angular/core';
import { CampaignCandidatePublic } from 'src/app/campaigns.module/models/campaign-candidates/campaign-candidate-public.model';
import { CampaignPublic } from 'src/app/campaigns.module/models/campaign-public.model';
import { User } from 'src/app/users.module/models/user.model';
import { VotingService } from 'src/app/votes.module/services/voting.service';
import { VotingVoucher } from '../../models/voting-voucher.model';

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

  isVoteCastDone = false;
  isVoteCastSuccessful = false;

  constructor(private readonly votingService: VotingService) {}

  ngOnInit(): void {
    this.candidates = this.campaign.candidates.sort(
      (x, y) => x.index - y.index
    );
  }

  async vote() {
    try {
      const response = await this.votingService.castVote(
        this.campaign,
        this.selectedCandidate,
        this.voucher,
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
