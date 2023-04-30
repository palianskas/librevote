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

  static map(data: Partial<CampaignPublicLinkDto>): CampaignPublicLinkDto {
    const dto = new CampaignPublicLinkDto();

    dto.id = data.id;
    dto.campaignId = data.campaignId;
    dto.link = data.link;

    if (!!data.validFrom) {
      dto.validFrom = new Date(data.validFrom);
    }
    if (!!data.validUntil) {
      dto.validFrom = new Date(data.validUntil);
    }

    if (!!data.campaign) {
      dto.campaign = CampaignPublicDto.map(data.campaign);
    }

    return dto;
  }
}
