import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouteNames } from 'src/app/app.module/app.routes';
import { Campaign } from '../../models/campaign.model';
import { CampaignsService } from '../../services/campaigns.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampaignResultsContainer } from '../../models/campaign-results/campaign-results-container.model';
import { ColorsService } from 'src/app/common.module/services/colors.service';
import { CandidateResults } from '../../models/campaign-results/candidate.results.model';

@Component({
  selector: 'app-campaign-vote-count-view',
  templateUrl: './campaign-results-view.component.html',
  styleUrls: ['./campaign-results-view.component.css'],
})
export class CampaignResultsViewComponent implements OnInit, OnDestroy {
  routeNames = RouteNames;
  paramsSubscription: Subscription;

  campaign: Campaign;

  resultsContainer?: CampaignResultsContainer;

  constructor(
    private readonly campaignService: CampaignsService,
    private readonly colorsService: ColorsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.paramsSubscription = this.route.params.subscribe(async (params) => {
      const id = params['id'];

      await this.initCampaign(id);

      this.validateCampaignStatus();
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  onCountFinished(results: CampaignResultsContainer): void {
    this.resultsContainer = results;

    if (this.resultsContainer.isCountSuccessful) {
      this.resultsContainer.results.candidateResults.forEach(
        (result) =>
          (result.candidate = this.campaign.candidates.find(
            (c) => c.id === result.candidateId
          ))
      );
    }
  }

  private async initCampaign(id: string): Promise<void> {
    this.campaign = await this.campaignService.get(id);
  }

  private validateCampaignStatus(): void {
    if (!this.campaign.isAfterVotingEnd()) {
      this.router.navigate([RouteNames.campaigns.index, this.campaign.id]);
    }
  }
}
