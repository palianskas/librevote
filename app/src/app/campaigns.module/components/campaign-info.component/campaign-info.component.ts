import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouteNames } from 'src/app/app.module/app.routes';
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

  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.paramsSubscription = this.route.params.subscribe((params) => {
      this.fetchCampaign(params['id']);
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  private async fetchCampaign(id: string): Promise<void> {
    this.campaign = await this.campaignsService.get(id);
  }
}
