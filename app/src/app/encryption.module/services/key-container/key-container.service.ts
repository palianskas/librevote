import { Injectable } from '@angular/core';
import { EncryptionDomainFactory } from '../encryption-domain/encryption-domain.factory';
import { KeyContainer, KeyContainerContext } from './key.container';
import { EncryptionService } from '../encryption.service';

@Injectable({ providedIn: 'root' })
export class KeyContainerService {
  private static _containerLocationPrefix = 'KEY-CONTAINER:';

  constructor(
    private readonly encryptionDomainFactory: EncryptionDomainFactory,
    private readonly encryptionService: EncryptionService
  ) {}

  extractKey(container: KeyContainer, password?: string): string | null {
    if (!container.canAccessKey(password)) {
      return null;
    }

    const key = container.getKey();

    if (!password) {
      return key;
    }

    const domain =
      this.encryptionDomainFactory.getAesEncryptionDomain(password);

    const decryptedKey = domain.decrypt(key);

    return decryptedKey;
  }

  build(key: string, campaignId: string, password?: string): KeyContainer {
    const context: KeyContainerContext = {
      campaignId: campaignId,
    };

    if (!!password) {
      const domain =
        this.encryptionDomainFactory.getAesEncryptionDomain(password);
      key = domain.encrypt(key);
    }

    const container = new KeyContainer(
      key,
      context,
      password,
      this.encryptionService
    );

    return container;
  }

  storeContainer(container: KeyContainer): void {
    const locationKey = this.getContainerLocationKey(
      container.context.campaignId
    );

    localStorage.setItem(locationKey, JSON.stringify(container));
  }

  getContainer(campaignId: string): KeyContainer | null {
    const locationKey = this.getContainerLocationKey(campaignId);

    const item = localStorage.getItem(locationKey);

    if (!item) {
      return null;
    }

    try {
      const rawContainer: KeyContainer = JSON.parse(item);

      const container = this.tryCopy(rawContainer);

      return container;
    } catch {
      return null;
    }
  }

  private tryCopy(data: any): KeyContainer | null {
    const isValid = this.isValidContainer(data);

    if (!isValid) {
      return null;
    }

    const container = new KeyContainer(
      data._key,
      data.context as KeyContainerContext,
      {
        value: data._password,
        salt: data._salt,
      },
      this.encryptionService
    );

    return container;
  }

  private isValidContainer(data: any): boolean {
    const isValid =
      !!data && !!data._key && KeyContainerContext.isValidContext(data.context);

    return isValid;
  }

  private getContainerLocationKey(campaignId): string {
    const locationKey =
      KeyContainerService._containerLocationPrefix + campaignId;

    return locationKey;
  }
}
