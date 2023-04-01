import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouteNames } from 'src/app/app.module/app.routes';
import { VotingMechanism } from '../../models/campaign-settings/campaign-settings.model';
import { Campaign } from '../../models/campaign.model';
import { CampaignsService } from '../../services/campaigns.service';

@Component({
  selector: 'app-campaign-info',
  templateUrl: './campaign-info.component.html',
})
export class CampaignInfoComponent implements OnInit, OnDestroy {
  paramsSubscription: Subscription;
  routeNames = RouteNames;

  campaign: Campaign;
  isInviteOnlyCampaign = false;

  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.paramsSubscription = this.route.params.subscribe((params) => {
      this.init(params['id']);
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  async init(campaignId: string): Promise<void> {
    this.campaign = await this.fetchCampaign(campaignId);

    this.isInviteOnlyCampaign =
      this.campaign.settings.votingMechanism === VotingMechanism.InviteOnly;
  }

  onVotingStartStopCallback(): void {
    this.init(this.campaign.id);
  }

  private async fetchCampaign(id: string): Promise<void> {
    this.campaign = await this.campaignsService.get(id);

  private async fetchCampaign(id: string): Promise<Campaign> {
    return this.campaignsService.get(id);
  }
}
