import { Component, Input, OnInit } from '@angular/core';
import { Campaign } from 'src/app/campaigns.module/models/campaign.model';
import { CampaignsService } from 'src/app/campaigns.module/services/campaigns.service';
import { Vote } from 'src/app/votes.module/models/vote.model';
import { VotesService } from 'src/app/votes.module/services/votes.service';

@Component({
  selector: 'app-campaign-vote-audit',
  templateUrl: './campaign-vote-audit.component.html',
})
export class CampaignVoteAuditComponent implements OnInit {
  @Input() campaign: Campaign;

  voteCount: number;

  isRefreshInProgress = false;

  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly votesService: VotesService
  ) {}

  async ngOnInit(): Promise<void> {
    this.voteCount = await this.fetchVoteCount(this.campaign.id);
  }

  public async refreshVoteCount(): Promise<void> {
    const count = await this.fetchVoteCount(this.campaign.id);

    this.isRefreshInProgress = true;

    setTimeout(() => {
      this.isRefreshInProgress = false;

      this.voteCount = count;
    }, 2000 + Math.random() * 2000);
  }

  private fetchVoteCount(campaignId: string): Promise<number> {
    return this.votesService.getCampaignVoteCount(campaignId);
  }
}
