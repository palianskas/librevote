import { CampaignDto } from '../campaign/campaign.dto';
import { CampaignResults } from './campaign-results.model';
import { CandidateResultsDto } from './candidate-results/candidate-results.dto';

export class CampaignResultsDto {
  id?: string;
  campaignId: string;
  totalVoteCount: string;
  campaign?: CampaignDto | null;
  candidateResults?: CandidateResultsDto[];

  static map(entity: CampaignResults): CampaignResultsDto {
    const dto = new CampaignResultsDto();

    dto.id = entity.id;
    dto.campaignId = entity.campaignId;
    dto.totalVoteCount = entity.totalVoteCount.toString();

    dto.campaign = entity.campaign && CampaignDto.map(entity.campaign);
    dto.candidateResults = CandidateResultsDto.mapList(entity.candidateResults);

    return dto;
  }
}
