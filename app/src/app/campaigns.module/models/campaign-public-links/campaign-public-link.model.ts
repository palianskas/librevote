import { Campaign, CampaignDto } from '../campaign.model';

export class CampaignPublicLink {
  id: string;
  campaignId: string;
  link: string;
  campaign?: Campaign;

  static map(dto: CampaignPublicLinkDto): CampaignPublicLink {
    const entity = new CampaignPublicLink();

    entity.id = dto.id;
    entity.campaignId = dto.campaignId;
    entity.link = dto.link;

    if (!!dto.campaign) {
      entity.campaign = Campaign.map(dto.campaign);
    }

    return entity;
  }
}

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
