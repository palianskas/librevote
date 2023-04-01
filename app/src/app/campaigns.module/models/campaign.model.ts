import {
  CampaignCandidate,
  CampaignCandidateDto,
} from './campaign-candidates/campaign-candidate.model';
import {
  CampaignPublicLink,
  CampaignPublicLinkDto,
} from './campaign-public-links/campaign-public-link.model';
import {
  CampaignSettings,
  CampaignSettingsDto,
} from './campaign-settings/campaign-settings.model';
import { CampaignUser, CampaignUserDto } from './campaign-user.model';

export class Campaign {
  id: string;
  name: string;
  pubKey?: string;
  startDate?: Date;
  endDate?: Date;

  campaignUsers: CampaignUser[];
  publicLink: CampaignPublicLink;
  candidates: CampaignCandidate[];
  settings: CampaignSettings;

  isVotingActive(now = new Date()): boolean {
    const isBeforeVotingStart = this.isBeforeVotingStart(now);
    const isBeforeVotingEnd = !this.endDate || now < this.endDate;

    return !isBeforeVotingStart && isBeforeVotingEnd;
  }

  isBeforeVotingStart(now = new Date()): boolean {
    return !this.startDate || now < this.startDate;
  }

  static map(dto: CampaignDto): Campaign {
    const entity = new Campaign();

    entity.id = dto.id;
    entity.name = dto.name;
    entity.pubKey = dto.pubKey;
    entity.startDate = dto.startDate && new Date(dto.startDate);
    entity.endDate = dto.endDate && new Date(dto.endDate);

    entity.campaignUsers = CampaignUser.mapList(dto.campaignUsers);
    entity.candidates = CampaignCandidate.mapList(dto.candidates);

    if (!!dto.publicLink) {
      entity.publicLink = CampaignPublicLink.map(dto.publicLink);
    }

    entity.settings = !!dto.settings
      ? CampaignSettings.map(dto.settings)
      : CampaignSettings.default;

    return entity;
  }
}

export class CampaignDto {
  id?: string;
  name: string;
  pubKey?: string;
  startDate?: Date;
  endDate?: Date;

  campaignUsers: CampaignUserDto[];
  publicLink: CampaignPublicLinkDto;
  candidates: CampaignCandidateDto[];
  settings: CampaignSettingsDto;

  static map(data: any): CampaignDto {
    const dto = new CampaignDto();

    dto.id = data.id;
    dto.name = data.name;
    dto.pubKey = data.pubKey;

    if (data.startDate) {
      dto.startDate = new Date(data.startDate);
    }
    if (data.endDate) {
      dto.endDate = new Date(data.endDate);
    }

    dto.campaignUsers = CampaignUserDto.mapList(data.campaignUsers);

    if (!!data.publicLink) {
      dto.publicLink = CampaignPublicLinkDto.map(data.publicLink);
    }

    dto.candidates = CampaignCandidateDto.mapList(data.candidates);

    dto.settings = !!data.settings
      ? CampaignSettingsDto.map(data.settings)
      : CampaignSettingsDto.default;

    return dto;
  }
}
