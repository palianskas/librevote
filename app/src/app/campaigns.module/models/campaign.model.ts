import {
  CampaignPublicLink,
  CampaignPublicLinkDto,
} from './campaign-public-links/campaign-public-link.model';
import { CampaignUserDto } from './campaign-user.model';

export class Campaign {
  id: string;
  name: string;
  pubKey: string;
  campaignUsers: CampaignUserDto[];
  publicLink: CampaignPublicLink;

  static map(dto: CampaignDto): Campaign {
    const entity = new Campaign();

    entity.id = dto.id;
    entity.name = dto.name;
    entity.pubKey = dto.pubKey;
    entity.campaignUsers = CampaignUserDto.mapList(dto.campaignUsers);

    if (!!dto.publicLink) {
      entity.publicLink = CampaignPublicLink.map(dto.publicLink);
    }

    return entity;
  }
}

export class CampaignDto {
  id?: string;
  name: string;
  pubKey: string;
  campaignUsers: CampaignUserDto[];
  publicLink: CampaignPublicLinkDto;

  static map(data: any): CampaignDto {
    const dto = new CampaignDto();

    dto.id = data.id;
    dto.name = data.name;
    dto.pubKey = data.pubKey;
    dto.campaignUsers = CampaignUserDto.mapList(data.campaignUsers);

    if (!!data.publicLink) {
      dto.publicLink = CampaignPublicLinkDto.map(data.publicLink);
    }

    return dto;
  }
}
