import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/users.module/models/user.model';
import { CampaignsService } from 'src/app/campaigns.module/services/campaigns.service';
import { RouteNames } from 'src/app/app.module/app.routes';
import { Campaign } from 'src/app/campaigns.module/models/campaign.model';

class CampaignOverviewContainer {
  totalCount: number;
  inProgressCount: number;
  inProgressCampaigns: Campaign[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private campaigns: Campaign[];
  campaignOverview: CampaignOverviewContainer;

  routeNames = RouteNames;

  @Input() user: User;

  constructor(private readonly campaignsService: CampaignsService) {}

  async ngOnInit(): Promise<void> {
    this.campaigns = await this.campaignsService.search({});

    this.campaignOverview = this.buildCampaignOverview(this.campaigns);
  }

  private buildCampaignOverview(
    campaigns: Campaign[]
  ): CampaignOverviewContainer {
    const now = new Date();
    const inProgressCampaigns = campaigns.filter((campaign) =>
      campaign.isActive()
    );

    const container: CampaignOverviewContainer = {
      totalCount: campaigns.length,
      inProgressCount: inProgressCampaigns.length,
      inProgressCampaigns: inProgressCampaigns,
    };

    return container;
  }
}
