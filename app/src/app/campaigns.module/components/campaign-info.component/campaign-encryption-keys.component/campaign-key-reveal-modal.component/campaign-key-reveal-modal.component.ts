import { Component, Input, OnInit } from '@angular/core';
import { Campaign } from 'src/app/campaigns.module/models/campaign.model';
import { BrowserHelpers } from 'src/app/encryption.module/browser.helpers';
import { KeyContainerService } from 'src/app/encryption.module/services/key-container/key-container.service';
import { KeyContainer } from 'src/app/encryption.module/services/key-container/key.container';

@Component({
  selector: 'app-campaign-key-reveal-modal',
  templateUrl: './campaign-key-reveal-modal.component.html',
})
export class CampaignPrivateKeyRevealModalComponent {
  @Input() campaign: Campaign;
  container: KeyContainer;

  password?: string;

  key?: string;

  isPasswordIncorrect = false;
  privateKeyCopied = false;

  constructor(private readonly keyContainerService: KeyContainerService) {}

  get isPasswordProtected(): boolean {
    return this.container?.isPasswordProtected;
  }

  private init(container: KeyContainer): void {
    this.container = container;

    if (this.container?.isPasswordProtected === false) {
      this.key = this.keyContainerService.extractKey(this.container);
    }
  }

  submitPassword(): void {
    if (!this.password) {
      this.isPasswordIncorrect = true;

      return;
    }

    this.key = this.keyContainerService.extractKey(
      this.container,
      this.password
    );

    this.isPasswordIncorrect = !this.key;
  }

  copyPrivateKey(): void {
    BrowserHelpers.copyToClipboard(this.key);
    this.privateKeyCopied = true;
  }

  openModal(container: KeyContainer): void {
    this.init(container);

    const button = document.getElementById('key-reveal-modal-open-button');
    button.click();
  }
}
