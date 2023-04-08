import { Component, Input } from '@angular/core';
import { Campaign } from 'src/app/campaigns.module/models/campaign.model';
import { CampaignsService } from 'src/app/campaigns.module/services/campaigns.service';

@Component({
  selector: 'app-campaign-voting-control',
  templateUrl: './campaign-voting-control.component.html',
})
export class CampaignVotingControlComponent {
  @Input() campaign: Campaign;
  @Input() onStartStopCallback: Function;

  constructor(private readonly campaignsService: CampaignsService) {}

  async start(): Promise<void> {
    if (!!this.campaign.startDate) {
      return;
    }

    if (!confirm('Start voting?')) {
      return;
    }

    await this.campaignsService.start(this.campaign.id);

    this.onStartStopCallback();
  }

  async stop(): Promise<void> {
    if (!!this.campaign.endDate) {
      return;
    }

    if (!confirm('Stop voting?')) {
      return;
    }

    await this.campaignsService.stop(this.campaign.id);

    this.onStartStopCallback();
  }
}
