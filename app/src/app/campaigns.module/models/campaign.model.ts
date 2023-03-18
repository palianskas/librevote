import {
  CampaignCandidate,
  CampaignCandidateDto,
} from './campaign-candidates/campaign-candidate.model';
import {
  CampaignPublicLink,
  CampaignPublicLinkDto,
} from './campaign-public-links/campaign-public-link.model';
import { CampaignUser, CampaignUserDto } from './campaign-user.model';

export class Campaign {
  id: string;
  name: string;
  pubKey: string;
  startDate: Date;
  endDate: Date;

  campaignUsers: CampaignUser[];
  publicLink: CampaignPublicLink;
  candidates: CampaignCandidate[];

  static map(dto: CampaignDto): Campaign {
    const entity = new Campaign();

    entity.id = dto.id;
    entity.name = dto.name;
    entity.pubKey = dto.pubKey;
    entity.startDate = dto.startDate;
    entity.endDate = dto.endDate;

    entity.campaignUsers = CampaignUser.mapList(dto.campaignUsers);
    entity.candidates = CampaignCandidate.mapList(dto.candidates);

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
  startDate: Date;
  endDate: Date;

  campaignUsers: CampaignUserDto[];
  publicLink: CampaignPublicLinkDto;
  candidates: CampaignCandidateDto[];

  static map(data: any): CampaignDto {
    const dto = new CampaignDto();

    dto.id = data.id;
    dto.name = data.name;
    dto.pubKey = data.pubKey;
    dto.startDate = new Date(data.startDate);
    dto.endDate = new Date(data.endDate);

    dto.campaignUsers = CampaignUserDto.mapList(data.campaignUsers);

    if (!!data.publicLink) {
      dto.publicLink = CampaignPublicLinkDto.map(data.publicLink);
    }

    return dto;
  }
}
