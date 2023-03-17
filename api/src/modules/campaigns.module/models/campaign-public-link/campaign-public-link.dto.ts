import { CampaignPublicLink } from './campaign-public-link.model';
import { CampaignDto } from '../campaign/campaign.dto';

export class CampaignPublicLinkDto {
  id?: string;
  campaignId: string;
  link: string;
  validFrom?: Date;
  validUntil?: Date;
  campaign?: CampaignDto;

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
      dto.campaign = CampaignDto.map(entity.campaign);
    }

    return dto;
  }
}
