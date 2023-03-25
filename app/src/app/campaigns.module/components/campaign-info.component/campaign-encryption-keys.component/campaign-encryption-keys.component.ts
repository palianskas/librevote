import { Component, Input, ViewChild } from '@angular/core';
import { BigInteger } from 'big-integer';
import {
  Campaign,
  CampaignDto,
} from 'src/app/campaigns.module/models/campaign.model';
import { CampaignsService } from 'src/app/campaigns.module/services/campaigns.service';
import { KeyContainerService } from 'src/app/encryption.module/key-container/key-container.service';
import { KeyHelpers } from 'src/app/encryption.module/key.helpers';
import { RngService } from 'src/app/encryption.module/services/rng.service';
import { CampaignEncryptionKeysModalComponent } from './campaign-encryption-keys-modal.component/campaign-encryption-keys-modal.component';

enum KeyStorageOption {
  DoNotStore,
  LocalEncrypted,
  LocalPlaintext,
}

@Component({
  selector: 'app-campaign-encryption-keys',
  templateUrl: './campaign-encryption-keys.component.html',
})
export class CampaignEncryptionKeysComponent {
  @Input() campaign: Campaign;

  @ViewChild(CampaignEncryptionKeysModalComponent)
  child: CampaignEncryptionKeysModalComponent;
  keyDownloadAnchorElement?: HTMLAnchorElement;

  keyPair: { n: BigInteger; lambda: BigInteger };

  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly keyContainerService: KeyContainerService
  ) {}

  getDisplayablePubKey(pubKey: string): string {
    return KeyHelpers.getDisplayableKey(pubKey);
  }

  async generate(): Promise<void> {
    this.openModal();
    this.keyPair = await RngService.generatePaillierKeyPair();
  }

  save(storageOption: KeyStorageOption, password?: string): void {
    this.campaign.pubKey = this.keyPair.n.toString();

    this.campaignsService.savePubKey(this.campaign);

    if (storageOption === KeyStorageOption.DoNotStore) {
      this.downloadPrivateKey();

      return;
    }

    this.savePrivateKey(password);
  }

  cancel(): void {
    this.keyPair = null;
  }

  openModal(): void {
    this.child.openModal();
  }

  private downloadPrivateKey(): void {
    const filename = 'private-key.txt';
    const fileContent = this.keyPair.lambda.toString();

    if (!this.keyDownloadAnchorElement) {
      this.keyDownloadAnchorElement = document.createElement('a');
    }
    const element = this.keyDownloadAnchorElement;
    element.setAttribute(
      'href',
      `data:text/json;charset=utf-8,${encodeURIComponent(fileContent)}`
    );
    element.setAttribute('download', filename);

    element.click();
  }

  private savePrivateKey(password?: string): void {
    const key = this.keyPair.lambda.toString();

    const container = this.keyContainerService.buildContainer(
      key,
      this.campaign.id,
      password
    );

    this.keyContainerService.storeContainer(container);
  }
}
