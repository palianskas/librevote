import {
  CampaignCandidatePublic,
  CampaignCandidatePublicDto,
} from './campaign-candidates/campaign-candidate-public.model';
import {
  CampaignSettingsPublic,
  CampaignSettingsPublicDto,
} from './campaign-settings/campaign-settings-public.model';

export class CampaignPublic {
  id: string;
  name: string;
  pubKey?: string;
  startDate?: Date;
  endDate?: Date;
  deleteDate?: Date;
  publicLink?: string;

  candidates: CampaignCandidatePublic[];
  settings?: CampaignSettingsPublic;

  static map(dto: CampaignPublicDto): CampaignPublic {
    const entity = new CampaignPublic();

    entity.id = dto.id;
    entity.name = dto.name;
    entity.pubKey = dto.pubKey;
    entity.startDate = dto.startDate && new Date(dto.startDate);
    entity.endDate = dto.endDate && new Date(dto.endDate);
    entity.deleteDate = dto.deleteDate && new Date(dto.deleteDate);
    entity.publicLink = dto.publicLink;

    entity.candidates = CampaignCandidatePublic.mapList(dto.candidates);

    entity.settings = dto.settings && CampaignSettingsPublic.map(dto.settings);

    return entity;
  }
}

export class CampaignPublicDto {
  id: string;
  name: string;
  pubKey?: string;
  startDate?: Date;
  endDate?: Date;
  deleteDate?: Date;
  publicLink?: string;

  candidates: CampaignCandidatePublicDto[];
  settings?: CampaignSettingsPublicDto;

  static map(data: Partial<CampaignPublicDto>): CampaignPublicDto {
    const dto = new CampaignPublicDto();

    dto.id = data.id;
    dto.name = data.name;
    dto.pubKey = data.pubKey;
    dto.startDate = data.startDate && new Date(data.startDate);
    dto.endDate = data.endDate && new Date(data.endDate);
    dto.deleteDate = data.deleteDate && new Date(data.deleteDate);

    dto.candidates = CampaignCandidatePublicDto.mapList(data.candidates);

    dto.settings =
      data.settings && CampaignSettingsPublicDto.map(data.settings);

    return dto;
  }
}
