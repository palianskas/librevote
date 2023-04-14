import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Campaign } from 'src/app/campaigns.module/models/campaign.model';
import { VoteProcessingService } from 'src/app/votes.module/services/vote-processing.service';
import { CampaignPrivateKeyAccessModalComponent } from '../../campaign-info.component/campaign-vote-audit.component/campaign-key-access-modal.component/campaign-key-access-modal.component';
import { CampaignResultsContainer } from 'src/app/campaigns.module/models/campaign-results/campaign-results-container.model';

@Component({
  selector: 'app-campaign-vote-count',
  templateUrl: './campaign-vote-count.component.html',
})
export class CampaignVoteCountComponent {
  @Input() campaign: Campaign;
  @Input() onCountFinished: (results: CampaignResultsContainer) => void;

  privateKey?: string;
  isCountInProgress = false;

  @ViewChild(CampaignPrivateKeyAccessModalComponent)
  private keyAccessModalChild: CampaignPrivateKeyAccessModalComponent;

  constructor(private readonly voteProcessingService: VoteProcessingService) {}

  public performVoteCount(): void {
    if (!!this.privateKey) {
      this.countVotes();
    } else {
      this.keyAccessModalChild.onBeginAccessKey();
    }
  }

  onPrivateKeyAccessed(key: string): void {
    this.privateKey = key;

    this.countVotes();
  }

  private async countVotes(): Promise<void> {
    this.isCountInProgress = true;
    const results = await this.voteProcessingService.executeCampaignVoteCount(
      this.campaign,
      this.privateKey
    );

    this.onCountFinished(results);

    this.isCountInProgress = false;
  }
}
