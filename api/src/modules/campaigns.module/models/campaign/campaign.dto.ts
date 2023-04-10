import {
  CampaignCandidateDto,
  CampaignCandidatePublicDto,
} from '../campaign-candidate/campaign-candidate.dto';
import { CampaignPublicLinkDto } from '../campaign-public-link/campaign-public-link.dto';
import { CampaignResultsDto } from '../campaign-results/campaign-results.dto';
import {
  CampaignSettingsDto,
  CampaignSettingsPublicDto,
} from '../campaign-settings/campaign-settings.model';
import { CampaignUserDto } from '../campaign-user/campaign-user.dto';
import { Campaign } from './campaign.model';

export class CampaignDto {
  id?: string;
  name: string;
  pubKey: string | null;
  startDate: Date | null;
  endDate: Date | null;
  deleteDate: Date | null;
  campaignUsers: CampaignUserDto[];
  publicLink: CampaignPublicLinkDto;
  candidates: CampaignCandidateDto[];
  settings: CampaignSettingsDto;
  results?: CampaignResultsDto;

  static map(entity: Campaign, includePubKey = false): CampaignDto {
    const dto = new CampaignDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.startDate = entity.startDate;
    dto.endDate = entity.endDate;
    dto.deleteDate = entity.deleteDate;

    dto.campaignUsers = CampaignUserDto.mapList(entity.campaignUsers);
    dto.candidates = CampaignCandidateDto.mapList(entity.candidates);

    if (includePubKey) {
      dto.pubKey = entity.pubKey;
    }

    if (!!entity.publicLinks) {
      const publicLink = CampaignPublicLinkDto.getAndMapActiveLink(
        entity.publicLinks,
      );

      if (!!publicLink) {
        dto.publicLink = publicLink;
      }
    }

    dto.settings = !!entity.settings
      ? CampaignSettingsDto.map(entity.settings)
      : CampaignSettingsDto.default;

    if (entity.results) {
      dto.results = CampaignResultsDto.map(entity.results);
    }

    return dto;
  }
}

export class CampaignPublicDto {
  id: string;
  name: string;
  pubKey: string | null;
  startDate: Date | null;
  endDate: Date | null;
  deleteDate: Date | null;
  publicLink: string | null;
  candidates: CampaignCandidatePublicDto[];
  settings: CampaignSettingsPublicDto | null;

  static map(entity: Campaign): CampaignPublicDto {
    const dto = new CampaignPublicDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.pubKey = entity.pubKey;
    dto.startDate = entity.startDate && new Date(entity.startDate);
    dto.endDate = entity.endDate && new Date(entity.endDate);
    dto.deleteDate = entity.deleteDate && new Date(entity.deleteDate);

    const publicLink =
      entity.publicLinks &&
      CampaignPublicLinkDto.getAndMapActiveLink(entity.publicLinks)?.link;

    dto.publicLink = publicLink ?? null;

    dto.candidates = CampaignCandidatePublicDto.mapList(entity.candidates);

    dto.settings =
      (entity.settings && CampaignSettingsPublicDto.map(entity.settings)) ??
      null;

    return dto;
  }
}
