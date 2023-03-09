import { CampaignPublicLink } from './campaign-public-link.model';
import { CampaignDto } from './campaign.dto';

export class CampaignPublicLinkDto {
  id?: string;
  campaignId: string;
  link: string;
  campaign?: CampaignDto;

  static map(entity: CampaignPublicLink): CampaignPublicLinkDto {
    const dto = new CampaignPublicLinkDto();

    dto.id = entity.id;
    dto.campaignId = entity.campaignId;
    dto.link = entity.link;

    if (!!entity.campaign) {
      dto.campaign = CampaignDto.map(entity.campaign);
    }

    return dto;
  }
}
