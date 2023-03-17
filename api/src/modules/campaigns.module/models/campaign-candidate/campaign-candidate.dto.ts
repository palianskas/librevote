import { CampaignCandidate } from './campaign-candidate.model';
import { CampaignDto } from '../campaign/campaign.dto';

export class CampaignCandidateDto {
  id?: string;
  name: string;
  description: string;

  imageFileId: string;

  campaignId: string;
  campaign?: CampaignDto;

  static map(entity: CampaignCandidate): CampaignCandidateDto {
    const dto = new CampaignCandidateDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.imageFileId = entity.imageFileId;

    dto.campaignId = entity.campaignId;
    if (!!entity.campaign) {
      dto.campaign = CampaignDto.map(entity.campaign);
    }

    return dto;
  }

  static mapList(
    entities: CampaignCandidate[] | undefined,
  ): CampaignCandidateDto[] {
    if (!entities) {
      return [];
    }

    return entities.map((entity) => this.map(entity));
  }
}
