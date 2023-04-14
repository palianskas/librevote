import { CampaignResultsDto } from '../../models/campaign-results/campaign-results.dto';

export interface ICampaignResultsSaveRequest {
  dto: CampaignResultsDto;
}

export interface ICampaignResultsSaveResponse {
  id: string;
}
