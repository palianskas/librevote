import { Component, Input, OnInit } from '@angular/core';
import { KeyContainerService } from 'src/app/encryption.module/services/key-container/key-container.service';
import { KeyContainer } from 'src/app/encryption.module/services/key-container/key.container';

@Component({
  selector: 'app-campaign-key-access-modal',
  templateUrl: './campaign-key-access-modal.component.html',
})
export class CampaignPrivateKeyAccessModalComponent implements OnInit {
  @Input() campaignId: string;
  @Input() onKeyAccessed: (key: string | null) => void;

  container: KeyContainer;

  key?: string;
  password?: string;

  isContainerNotFound = true;
  isPasswordIncorrect = false;

  constructor(private readonly keyContainerService: KeyContainerService) {}

  ngOnInit(): void {
    this.container = this.keyContainerService.getContainer(this.campaignId);

    if (!this.container) {
      this.isContainerNotFound = true;

      return;
    }

    if (this.container.isPasswordProtected === false) {
      this.key = this.keyContainerService.extractKey(this.container);
    }
  }

  get isPasswordProtected(): boolean {
    return this.container?.isPasswordProtected;
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

    if (!!this.key) {
      this.onKeyAccessed(this.key);
      this.closeModal();
    } else {
      this.isPasswordIncorrect = true;
    }
  }

  submitPrivateKey(): void {
    if (!this.key) {
      return;
    } else {
      this.onKeyAccessed(this.key);
      this.closeModal();
    }
  }

  onBeginAccessKey(): void {
    if (!!this.key) {
      this.onKeyAccessed(this.key);
    } else {
      this.openModal();
    }
  }

  openModal(): void {
    const button = document.getElementById('key-access-modal-open-button');
    button.click();
  }

  closeModal(): void {
    const button = document.getElementById('key-access-modal-close-button');
    button.click();
  }
}
