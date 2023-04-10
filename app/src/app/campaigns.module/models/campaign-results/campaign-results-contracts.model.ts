import { CampaignResultsDto } from './campaign-results.model';

export interface ICampaignResultsSaveRequest {
  dto: CampaignResultsDto;
  force: boolean;
}

export interface ICampaignResultsSaveResponse {
  id: string;
}
