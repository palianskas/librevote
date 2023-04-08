import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouteNames } from 'src/app/app.module/app.routes';
import { VotingMechanism } from '../../models/campaign-settings/campaign-settings.model';
import { Campaign } from '../../models/campaign.model';
import { CampaignsService } from '../../services/campaigns.service';
import { CampaignPermissionsService } from '../../services/campaign-permissions.service';

@Component({
  selector: 'app-campaign-info',
  templateUrl: './campaign-info.component.html',
})
export class CampaignInfoComponent implements OnInit, OnDestroy {
  paramsSubscription: Subscription;
  routeNames = RouteNames;

  campaign: Campaign;
  qualifiedPublicLink: string;

  isInviteOnlyCampaign = false;
  isUserAdmin = false;

  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly campaignPermissionsService: CampaignPermissionsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
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

    this.isUserAdmin = this.campaignPermissionsService.isAdmin(this.campaign);

    this.qualifiedPublicLink = this.buildQualifiedPublicLink(
      this.campaign.publicLink.link
    );
  }

  onVotingStartStopCallback(): void {
    this.init(this.campaign.id);
  }

  async delete(): Promise<void> {
    if (!confirm('Delete campaign?')) {
      return;
    }

    await this.campaignsService.delete(this.campaign.id);

    this.router.navigate([RouteNames.campaigns.index]);
  }

  openCampaignPublicLink(): void {
    const publicLink = this.buildQualifiedPublicLink(
      this.campaign.publicLink.link,
      true
    );

    window.open(publicLink, '_blank');
  }

  private async fetchCampaign(id: string): Promise<Campaign> {
    return this.campaignsService.get(id);
  }

  private buildQualifiedPublicLink(
    campaignPublicLink: string,
    includeProtocol = false
  ): string {
    const rootUrl = includeProtocol ? location.origin : location.host;

    const publicLink = `${rootUrl}/${RouteNames.vote.index}/${campaignPublicLink}`;

    return publicLink;
  }
}
