import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampaignPublicLink } from '../../models/campaign-public-links/campaign-public-link.model';
import { CampaignPublicLinksService } from '../../services/campaign-public-links.service';

@Component({
  selector: 'app-campaign-public-link-view',
  templateUrl: './campaign-public-link-view.component.html',
})
export class CampaignPublicLinkViewComponent implements OnInit {
  campaignPublicLink: CampaignPublicLink;

  paramsSubscription: Subscription;

  constructor(
    private readonly campaignPublicLinksService: CampaignPublicLinksService,
    private readonly route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.paramsSubscription = this.route.params.subscribe((params) => {
      const publicLink = params['link'];

      this.fetchCampaignPublicLink(publicLink);
    });
  }

  private async fetchCampaignPublicLink(publicLink: string): Promise<void> {
    this.campaignPublicLink = await this.campaignPublicLinksService.getByLink(
      publicLink
    );
  }
}
