import { CampaignPublicLink } from './campaign-public-link.model';
import { CampaignPublicDto } from '../campaign/campaign.dto';

export class CampaignPublicLinkDto {
  id?: string;
  campaignId: string;
  link: string;
  validFrom?: Date;
  validUntil?: Date;
  campaign?: CampaignPublicDto;

  static map(entity: CampaignPublicLink): CampaignPublicLinkDto {
    const dto = new CampaignPublicLinkDto();

    dto.id = entity.id;
    dto.campaignId = entity.campaignId;
    dto.link = entity.link;

    if (!!entity.validFrom) {
      dto.validFrom = entity.validFrom;
    }
    if (!!entity.validUntil) {
      dto.validUntil = entity.validUntil;
    }

    if (!!entity.campaign) {
      dto.campaign = CampaignPublicDto.map(entity.campaign);
    }

    return dto;
  }

  static getAndMapActiveLink(
    entities: CampaignPublicLink[],
  ): CampaignPublicLinkDto | undefined {
    const activeLink = entities.find((entity) => this.isActive(entity));

    if (!activeLink) {
      return;
    }

    return this.map(activeLink);
  }

  private static isActive(link: CampaignPublicLink): boolean {
    if (link.validFrom === null && link.validUntil === null) {
      return true;
    }

    const currentTimestamp = Date.now();

    if (link.validFrom === null && link.validUntil !== null) {
      return currentTimestamp < link.validUntil.getUTCMilliseconds();
    }
    if (link.validFrom !== null && link.validUntil === null) {
      return currentTimestamp > link.validFrom.getUTCMilliseconds();
    }

    return (
      (!link.validFrom ||
        link.validFrom.getUTCMilliseconds() < currentTimestamp) &&
      (!link.validUntil ||
        currentTimestamp < link.validUntil.getUTCMilliseconds())
    );
  }
}
