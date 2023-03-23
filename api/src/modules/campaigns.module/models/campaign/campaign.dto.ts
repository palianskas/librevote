import { CampaignCandidateDto } from '../campaign-candidate/campaign-candidate.dto';
import { CampaignPublicLinkDto } from '../campaign-public-link/campaign-public-link.dto';
import { CampaignSettingsDto } from '../campaign-settings/campaign-settings.model';
import { CampaignUserDto } from '../campaign-user/campaign-user.dto';
import { DistrictDto } from '../district/district.dto';
import { Campaign } from './campaign.model';

export class CampaignDto {
  id?: string;
  name: string;
  pubKey: string;
  startDate: Date | null;
  endDate: Date | null;
  campaignUsers: CampaignUserDto[];
  districts: DistrictDto[];
  publicLink: CampaignPublicLinkDto;
  candidates: CampaignCandidateDto[];
  settings: CampaignSettingsDto;

  static map(entity: Campaign): CampaignDto {
    const dto = new CampaignDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.pubKey = entity.pubKey;
    dto.startDate = entity.startDate;
    dto.endDate = entity.endDate;

    dto.campaignUsers = CampaignUserDto.mapList(entity.campaignUsers);
    dto.districts = DistrictDto.mapList(entity.districts);
    dto.candidates = CampaignCandidateDto.mapList(entity.candidates);

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
