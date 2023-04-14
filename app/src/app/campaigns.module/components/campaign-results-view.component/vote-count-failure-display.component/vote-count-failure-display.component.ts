import { Component, Input } from '@angular/core';
import { CampaignVoteCountFailureStatus } from 'src/app/campaigns.module/models/campaign-results/campaign-results-container.model';

@Component({
  selector: 'app-vote-count-failure-display',
  templateUrl: './vote-count-failure-display.component.html',
})
export class VoteCountFailureDisplayComponent {
  @Input() failureStatus: CampaignVoteCountFailureStatus;
}
