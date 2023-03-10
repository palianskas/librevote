import { Component } from '@angular/core';
import { Campaign, CampaignDto } from '../../models/campaign.model';
import { CampaignsService } from '../../services/campaigns.service';

@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
})
export class CampaignFormComponent {
  campaign: Campaign;

  constructor(private readonly campaignsService: CampaignsService) {}

  temp() {
    const dto: CampaignDto = {
      name: 'campaign name',
      pubKey: '123',
      campaignUsers: [],
    };

    this.campaignsService.create(dto);
  }
}
