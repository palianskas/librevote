import { CampaignCandidateDto } from '../../campaign-candidate/campaign-candidate.dto';
import { CampaignResultsDto } from '../campaign-results.dto';
import { CandidateResults } from './candidate-results.model';

export class CandidateResultsDto {
  id: string;
  candidateId: string;
  voteCount: string;
  campaignResultsId: string;
  candidate?: CampaignCandidateDto | null;
  campaignResults?: CampaignResultsDto | null;

  static map(entity: CandidateResults): CandidateResultsDto {
    const dto = new CandidateResultsDto();

    dto.id = entity.id;
    dto.candidateId = entity.candidateId;
    dto.voteCount = entity.voteCount;
    dto.campaignResultsId = entity.campaignResultsId;

    dto.candidate =
      entity.candidate && CampaignCandidateDto.map(entity.candidate);
    dto.campaignResults =
      entity.campaignResults && CampaignResultsDto.map(entity.campaignResults);

    return dto;
  }

  static mapList(
    entities: CandidateResults[] | undefined,
  ): CandidateResultsDto[] {
    if (!entities) {
      return [];
    }

    return entities.map((entity) => this.map(entity));
  }
}
