import { Component, Input } from '@angular/core';
import { CampaignResults } from 'src/app/campaigns.module/models/campaign-results/campaign-results.model';
import { CampaignResultsService } from 'src/app/campaigns.module/services/campaign-results.service';

@Component({
  selector: 'app-campaign-saved-results-view',
  templateUrl: './campaign-saved-results-view.component.html',
})
export class CampaignSavedResultsViewComponent {
  @Input() encryptedResults: CampaignResults;
  @Input() onResultsDecrypted: (results: CampaignResults) => void;

  decryptedResults: CampaignResults;

  isToggled = false;
  password: string;
  isPasswordIncorrect = false;

  constructor(
    private readonly campaignResultsService: CampaignResultsService
  ) {}

  async onConfirm(): Promise<void> {
    if (!this.password) {
      return;
    }

    this.decryptedResults = this.campaignResultsService.decryptResults(
      this.encryptedResults,
      this.password
    );

    if (!this.validateDecryptedResults(this.decryptedResults)) {
      this.isPasswordIncorrect = true;
      return;
    }

    this.isPasswordIncorrect = false;
    this.isToggled = false;

    this.onResultsDecrypted(this.decryptedResults);
  }

  private validateDecryptedResults(results: CampaignResults): boolean {
    return !!results.totalVoteCount && !isNaN(+results.totalVoteCount);
  }
}
