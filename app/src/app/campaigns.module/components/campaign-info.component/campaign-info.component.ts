import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaign } from '../../models/campaign.model';
import { CampaignsService } from '../../services/campaigns.service';

@Component({
  selector: 'app-campaign-info',
  templateUrl: './campaign-info.component.html',
})
export class CampaignInfoComponent implements OnInit {
  campaign: Campaign;

  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.params.subscribe((params) => {
      this.fetchCampaign(params['id']);
    });
  }

  private async fetchCampaign(id: string): Promise<void> {
    this.campaign = await this.campaignsService.get(id);
  }
}
