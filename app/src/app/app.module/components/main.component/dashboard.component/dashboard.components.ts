import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/users.module/models/user.model';
import { CampaignsService } from 'src/app/campaigns.module/services/campaigns.service';
import { RouteNames } from 'src/app/app.module/app.routes';
import { Campaign } from 'src/app/campaigns.module/models/campaign.model';
import { Router } from '@angular/router';
import { StringHelpers } from 'src/app/encryption.module/string.helpers';

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

  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.campaigns = await this.campaignsService.search({});

    this.campaignOverview = this.buildCampaignOverview(this.campaigns);
  }

  openCampaign(id: string): void {
    this.router.navigate([RouteNames.campaigns.index, id]);
  }

  getDisplayableDate(date?: Date): string {
    return StringHelpers.campaignDateTimeToString(date);
  }

  private buildCampaignOverview(
    campaigns: Campaign[]
  ): CampaignOverviewContainer {
    const inProgressCampaigns = campaigns.filter((campaign) =>
      campaign.isVotingActive()
    );

    const container: CampaignOverviewContainer = {
      totalCount: campaigns.length,
      inProgressCount: inProgressCampaigns.length,
      inProgressCampaigns: inProgressCampaigns,
    };

    return container;
  }
}
