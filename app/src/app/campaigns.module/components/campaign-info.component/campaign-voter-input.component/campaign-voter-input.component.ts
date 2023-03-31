import { Component, Input } from '@angular/core';
import * as Papaparse from 'papaparse';
import { Campaign } from 'src/app/campaigns.module/models/campaign.model';
import { ValidationHelpers } from 'src/app/encryption.module/validation.helpers';
import { VotingVouchersService } from 'src/app/votes.module/services/vouchers.service';

@Component({
  selector: 'app-campaign-voter-input',
  templateUrl: './campaign-voter-input.component.html',
})
export class CampaignVoterInputComponent {
  @Input() campaign: Campaign;

  voterEmailInputValue: string;
  enteredVoterEmails: string[] = [];
  isEmailInputInvalid = false;
  isEmailChipDisplayHidden = true;

  constructor(private readonly vouchersService: VotingVouchersService) {}

  onSubmit() {
    this.vouchersService.createMany(this.campaign, this.enteredVoterEmails);
  }

  onFilesInput(event: Event) {
    const files = (event.target as HTMLInputElement).files;

    Array.from(files).forEach(async (file) => {
      if (!file.name.endsWith('.csv')) {
        return;
      }

      const entries = await this.parseCsv(file);
      const emails = entries.filter((entry) =>
        ValidationHelpers.isEmail(entry)
      );

      this.enteredVoterEmails = this.enteredVoterEmails.concat(emails);
    });

    (document.getElementById('file-input') as HTMLInputElement).value = null;
  }

  onEmailInput() {
    if (!ValidationHelpers.isEmail(this.voterEmailInputValue)) {
      this.isEmailInputInvalid = true;

      return;
    }

    this.enteredVoterEmails.push(this.voterEmailInputValue);

    this.voterEmailInputValue = null;
    this.isEmailInputInvalid = false;
  }

  async parseCsv(file: File): Promise<string[]> {
    let onResolve: Function;
    const promise = new Promise<string[]>((resolve) => {
      onResolve = resolve;
    });

    Papaparse.parse<string>(file, {
      complete: (result) => {
        const rows = result.data;

        const entries = rows.flat();
        onResolve(entries);
      },
      error: () => {
        onResolve([]);
      },
    });

    return promise;
  }
}
