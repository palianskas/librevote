import { CampaignPublic, CampaignPublicDto } from '../campaign-public.model';

export class CampaignPublicLink {
  id: string;
  campaignId: string;
  link: string;
  validFrom?: Date;
  validUntil?: Date;

  campaign?: CampaignPublic;

  static map(dto: CampaignPublicLinkDto): CampaignPublicLink {
    const entity = new CampaignPublicLink();

    entity.id = dto.id;
    entity.campaignId = dto.campaignId;
    entity.link = dto.link;

    if (!!dto.validFrom) {
      entity.validFrom = new Date(dto.validFrom);
    }
    if (!!dto.validUntil) {
      entity.validFrom = new Date(dto.validUntil);
    }

    if (!!dto.campaign) {
      entity.campaign = CampaignPublic.map(dto.campaign);
    }

    return entity;
  }
}

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
      dto.validFrom = new Date(entity.validFrom);
    }
    if (!!entity.validUntil) {
      dto.validFrom = new Date(entity.validUntil);
    }

    if (!!entity.campaign) {
      dto.campaign = CampaignPublicDto.map(entity.campaign);
    }

    return dto;
  }
}
