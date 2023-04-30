import { Campaign, CampaignDto } from '../campaign.model';
import {
  CandidateResults,
  CandidateResultsDto,
} from './candidate.results.model';

export class CampaignResults {
  id?: string;
  campaignId: string;
  totalVoteCount: string;
  campaign?: Campaign | null;
  candidateResults?: CandidateResults[];

  static map(dto: CampaignResultsDto): CampaignResults {
    const entity = new CampaignResults();

    entity.id = dto.id;
    entity.campaignId = dto.campaignId;
    entity.totalVoteCount = dto.totalVoteCount;

    entity.campaign = dto.campaign && Campaign.map(dto.campaign);
    entity.candidateResults = CandidateResults.mapList(dto.candidateResults);

    return entity;
  }
}

export class CampaignResultsDto {
  id?: string;
  campaignId: string;
  totalVoteCount: string;
  campaign?: CampaignDto | null;
  candidateResults?: CandidateResultsDto[];

  static map(data: Partial<CampaignResultsDto>): CampaignResultsDto {
    const dto = new CampaignResultsDto();

    dto.id = data.id;
    dto.campaignId = data.campaignId;
    dto.totalVoteCount = data.totalVoteCount;

    dto.campaign = data.campaign && CampaignDto.map(data.campaign);
    dto.candidateResults = CandidateResultsDto.mapList(data.candidateResults);

    return dto;
  }
}
