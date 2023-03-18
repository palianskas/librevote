import { Campaign, CampaignDto } from '../campaign.model';

export class CampaignCandidate {
  id?: string;
  name: string;
  description: string;

  imageFileId: string;

  campaignId: string;
  campaign?: CampaignDto;

  static map(dto: CampaignCandidateDto): CampaignCandidate {
    const entity = new CampaignCandidate();

    entity.id = dto.id;
    entity.name = dto.name;
    entity.description = dto.description;
    entity.imageFileId = dto.imageFileId;

    entity.campaignId = dto.campaignId;
    if (!!dto.campaign) {
      entity.campaign = Campaign.map(dto.campaign);
    }

    return entity;
  }

  static mapList(
    dtos: CampaignCandidateDto[] | undefined
  ): CampaignCandidate[] {
    if (!dtos) {
      return [];
    }

    return dtos.map((dto) => this.map(dto));
  }
}

export class CampaignCandidateDto {
  id?: string;
  name: string;
  description: string;

  imageFileId: string;

  campaignId: string;
  campaign?: CampaignDto;

  static map(data: any): CampaignCandidateDto {
    const dto = new CampaignCandidateDto();

    dto.id = data.id;
    dto.name = data.name;
    dto.description = data.description;
    dto.imageFileId = data.imageFileId;

    dto.campaignId = data.campaignId;
    if (!!data.campaign) {
      dto.campaign = CampaignDto.map(data.campaign);
    }

    return dto;
  }

  static mapList(entries: any[] | undefined): CampaignCandidate[] {
    if (!entries) {
      return [];
    }

    return entries.map((entry) => this.map(entry));
  }
}