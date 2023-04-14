import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouteNames } from 'src/app/app.module/app.routes';
import { Campaign } from '../../models/campaign.model';
import { CampaignsService } from '../../services/campaigns.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  CampaignResultsContainer,
  ResultsSource,
} from '../../models/campaign-results/campaign-results-container.model';
import { CampaignResults } from '../../models/campaign-results/campaign-results.model';

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
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  get isResultsSaveEnabled(): boolean {
    return this.resultsContainer.source === ResultsSource.Calculation;
  }

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
      this.resultsContainer.source = ResultsSource.Calculation;

      this.resultsContainer.results.candidateResults.forEach(
        (result) =>
          (result.candidate = this.campaign.candidates.find(
            (c) => c.id === result.candidateId
          ))
      );

      this.initResultsStructure(this.resultsContainer.results);
    }
  }

  onResultsDecrypted(results: CampaignResults): void {
    this.resultsContainer = {
      results: results,
      isCountSuccessful: true,
      source: ResultsSource.Storage,
    };

    this.initResultsStructure(this.resultsContainer.results);
  }

  private async initCampaign(id: string): Promise<void> {
    this.campaign = await this.campaignService.get(id);
  }

  private validateCampaignStatus(): void {
    if (!this.campaign.isAfterVotingEnd()) {
      this.router.navigate([RouteNames.campaigns.index, this.campaign.id]);
    }
  }

  private initResultsStructure(results: CampaignResults) {
    results.candidateResults = results.candidateResults?.sort(
      (x, y) => x.candidate.index - y.candidate.index
    );
  }
}
