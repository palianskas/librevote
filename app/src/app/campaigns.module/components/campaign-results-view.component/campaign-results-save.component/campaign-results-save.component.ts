import { Component, Input } from '@angular/core';
import {
  CampaignResults,
  CampaignResultsDto,
} from 'src/app/campaigns.module/models/campaign-results/campaign-results.model';
import { CampaignResultsService } from 'src/app/campaigns.module/services/campaign-results.service';

@Component({
  selector: 'app-campaign-results-save',
  templateUrl: './campaign-results-save.component.html',
})
export class CampaignResultsSaveComponent {
  @Input() results: CampaignResults;

  isToggled = false;
  isForceSaveEnabled = false;
  password: string;
  isResultAlreadySaved = false;
  isSaveComplete = false;

  constructor(
    private readonly campaignResultsService: CampaignResultsService
  ) {}

  async onConfirm(): Promise<void> {
    if (!this.password) {
      return;
    }

    const dto = CampaignResultsDto.map(this.results);

    try {
      await this.campaignResultsService.save(dto, this.isForceSaveEnabled);

      this.isToggled = false;
      this.isResultAlreadySaved = true;
      this.isSaveComplete = true;
    } catch (e) {
      const statusCode = `${e.error.statusCode ?? e.status}`;

      if (!!statusCode?.startsWith && statusCode.startsWith('4')) {
        this.isResultAlreadySaved = true;
      }
    }
  }
}
