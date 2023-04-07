import { Component, Input, OnInit } from '@angular/core';
import * as Papaparse from 'papaparse';
import { Campaign } from 'src/app/campaigns.module/models/campaign.model';
import { ValidationHelpers } from 'src/app/encryption.module/validation.helpers';
import { VotingVouchersService } from 'src/app/votes.module/services/vouchers.service';

enum RegistrationEntryState {
  Valid,
  Pending,
  Invalid,
}

class RegistrationEntry {
  username: string;
  state: RegistrationEntryState;
  voucherId?: string;
}

@Component({
  selector: 'app-campaign-voter-input',
  templateUrl: './campaign-voter-input.component.html',
})
export class CampaignVoterInputComponent implements OnInit {
  @Input() campaign: Campaign;

  pendingRegistrations: RegistrationEntry[] = [];
  savedRegistrations: RegistrationEntry[] = [];
  invalidRegistrations: RegistrationEntry[] = [];

  emailInputValue: string;
  isEmailInputInvalid = false;
  isEmailChipDisplayHidden = true;

  constructor(private readonly vouchersService: VotingVouchersService) {}

  async ngOnInit(): Promise<void> {
    this.savedRegistrations = await this.fetchSavedRegistrations();
  }

  async onSubmit() {
    const emails = this.pendingRegistrations.map((entry) => entry.username);

    await this.vouchersService.createMany(this.campaign, emails);

    this.savedRegistrations = await this.fetchSavedRegistrations();

    this.flushRegistrations();
  }

  onFilesInput(event: Event) {
    const files = (event.target as HTMLInputElement).files;

    Array.from(files).forEach(async (file) => {
      if (!file.name.endsWith('.csv')) {
        return;
      }

      const entries = await this.parseCsv(file);

      const registrations = entries
        .filter((entry) => ValidationHelpers.isEmail(entry))
        .map((email) => ({
          username: email,
          state: RegistrationEntryState.Pending,
        }));

      this.pendingRegistrations =
        this.pendingRegistrations.concat(registrations);
    });

    (document.getElementById('file-input') as HTMLInputElement).value = null;
  }

  onEmailInput() {
    if (!ValidationHelpers.isEmail(this.emailInputValue)) {
      this.isEmailInputInvalid = true;

      return;
    }

    this.pendingRegistrations.push({
      username: this.emailInputValue,
      state: RegistrationEntryState.Pending,
    });

    this.emailInputValue = null;
    this.isEmailInputInvalid = false;
  }

  async deleteSavedRegistration(index: number): Promise<void> {
    if (index >= this.savedRegistrations.length) {
      return;
    }

    const entry = this.savedRegistrations[index];

    if (!entry.voucherId) {
      return;
    }

    if (!confirm('Delete this voting invite?')) {
      return;
    }

    await this.vouchersService.delete(entry.voucherId);

    this.savedRegistrations.splice(index, 1);
  }

  private async parseCsv(file: File): Promise<string[]> {
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

  private async fetchSavedRegistrations(): Promise<RegistrationEntry[]> {
    const existingCampaignVouchers = await this.vouchersService.search(
      this.campaign.id
    );

    const entries: RegistrationEntry[] = [];

    existingCampaignVouchers.forEach((voucher) => {
      if (!voucher.designatedUser) {
        return;
      }

      entries.push({
        username: voucher.designatedUser.email,
        state: RegistrationEntryState.Valid,
        voucherId: voucher.id,
      });
    });

    return entries;
  }

  private flushRegistrations(): void {
    this.invalidRegistrations = this.filterInvalidRegistrations(
      this.savedRegistrations,
      this.pendingRegistrations
    );

    this.pendingRegistrations = [];
  }

  private filterInvalidRegistrations(
    savedRegistrations: RegistrationEntry[],
    pendingRegistrations: RegistrationEntry[]
  ): RegistrationEntry[] {
    const invalidRegistrations: RegistrationEntry[] = [];

    const savedUsernames = savedRegistrations.map((entry) => entry.username);

    pendingRegistrations.forEach((entry) => {
      if (!savedUsernames.includes(entry.username)) {
        invalidRegistrations.push({
          username: entry.username,
          state: RegistrationEntryState.Invalid,
        });
      }
    });

    return invalidRegistrations;
  }
}
