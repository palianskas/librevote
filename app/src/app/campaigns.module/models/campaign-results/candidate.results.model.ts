import {
  CampaignCandidate,
  CampaignCandidateDto,
} from '../campaign-candidates/campaign-candidate.model';
import { CampaignResults, CampaignResultsDto } from './campaign-results.model';

export class CandidateResults {
  id?: string;
  candidateId: string;
  voteCount: string;
  campaignResultsId?: string;
  candidate?: CampaignCandidate | null;
  campaignResults?: CampaignResults | null;

  static map(dto: CandidateResultsDto): CandidateResults {
    const entity = new CandidateResults();

    entity.id = dto.id;
    entity.candidateId = dto.candidateId;
    entity.voteCount = dto.voteCount;
    entity.campaignResultsId = dto.campaignResultsId;

    entity.candidate = dto.candidate && CampaignCandidate.map(dto.candidate);
    entity.campaignResults =
      dto.campaignResults && CampaignResults.map(dto.campaignResults);

    return entity;
  }

  static mapList(dtos: CandidateResultsDto[] | undefined): CandidateResults[] {
    if (!dtos) {
      return [];
    }

    return dtos.map((entity) => this.map(entity));
  }
}

export class CandidateResultsDto {
  id?: string;
  candidateId: string;
  voteCount: string;
  campaignResultsId?: string;
  candidate?: CampaignCandidateDto | null;
  campaignResults?: CampaignResultsDto | null;

  static map(data: Partial<CandidateResultsDto>): CandidateResultsDto {
    const dto = new CandidateResultsDto();

    dto.id = data.id;
    dto.candidateId = data.candidateId;
    dto.voteCount = data.voteCount;
    dto.campaignResultsId = data.campaignResultsId;

    dto.candidate = data.candidate && CampaignCandidateDto.map(data.candidate);
    dto.campaignResults =
      data.campaignResults && CampaignResultsDto.map(data.campaignResults);

    return dto;
  }

  static mapList(
    data: Partial<CandidateResultsDto>[] | undefined
  ): CandidateResultsDto[] {
    if (!data) {
      return [];
    }

    return data.map((entity) => this.map(entity));
  }
}
