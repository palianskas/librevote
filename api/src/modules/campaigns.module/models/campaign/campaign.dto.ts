import { CampaignCandidateDto } from '../campaign-candidate/campaign-candidate.dto';
import { CampaignPublicLinkDto } from '../campaign-public-link/campaign-public-link.dto';
import { CampaignSettingsDto } from '../campaign-settings/campaign-settings.model';
import { CampaignUserDto } from '../campaign-user/campaign-user.dto';
import { Campaign } from './campaign.model';

export class CampaignDto {
  id?: string;
  name: string;
  pubKey: string | null;
  startDate: Date | null;
  endDate: Date | null;
  campaignUsers: CampaignUserDto[];
  publicLink: CampaignPublicLinkDto;
  candidates: CampaignCandidateDto[];
  settings: CampaignSettingsDto;

  static map(entity: Campaign, includePubKey = false): CampaignDto {
    const dto = new CampaignDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.startDate = entity.startDate;
    dto.endDate = entity.endDate;

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

    return dto;
  }
}
