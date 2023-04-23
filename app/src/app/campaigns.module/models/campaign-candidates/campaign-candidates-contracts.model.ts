import { CampaignCandidateDto } from './campaign-candidate.model';

export interface ICampaignCandidateCreateRequest {
  dto: CampaignCandidateDto;
}
export interface ICampaignCandidateCreateResponse {
  id: string;
}
