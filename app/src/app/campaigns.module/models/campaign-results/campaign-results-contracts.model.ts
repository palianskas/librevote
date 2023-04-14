import { CampaignResultsDto } from './campaign-results.model';

export interface ICampaignResultsSaveRequest {
  dto: CampaignResultsDto;
}

export interface ICampaignResultsSaveResponse {
  id: string;
}
