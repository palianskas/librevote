import { Injectable } from '@angular/core';
import { BigInteger } from 'big-integer';
import { KeyContainer, KeyContainerContext } from './key.container';

@Injectable({ providedIn: 'root' })
export class KeyContainerService {
  private static _containerLocationPrefix = 'KEY-CONTAINER:';

  extractKey(container: KeyContainer, password?: string): BigInteger | null {
    return container.extract(password);
  }

  buildContainer(
    key: BigInteger,
    campaignId: string,
    password?: string
  ): KeyContainer {
    const context: KeyContainerContext = {
      campaignId: campaignId,
    };

    const container = new KeyContainer(key, context, password);

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

      const container = KeyContainer.map(rawContainer);

      return container;
    } catch {
      return null;
    }
  }

  private getContainerLocationKey(campaignId): string {
    const locationKey =
      KeyContainerService._containerLocationPrefix + campaignId;

    return locationKey;
  }
}
