import { CampaignCandidateDto } from '../../models/campaign-candidate/campaign-candidate.dto';

export interface ICampaignCandidateCreateRequest {
  dto: CampaignCandidateDto;
}
export interface ICampaignCandidateCreateResponse {
  id: string;
}
export interface ICampaignCandidateUpdateRequest {
  dto: CampaignCandidateDto;
}
export interface ICampaignCandidateUpdateResponse {
  dto: CampaignCandidateDto;
}
