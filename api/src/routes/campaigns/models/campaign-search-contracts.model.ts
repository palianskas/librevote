import { CampaignDto } from 'src/services/campaigns/models/campaign.dto';

export interface ICampaignSearchRequest {
  campaignIds?: string[];
  userIds?: string[];
}
export interface ICampaignSearchResponse {
  rows: CampaignDto[];
}

export interface ICampaignCreateRequest {
  dto: CampaignDto;
}
export interface ICampaignCreateResponse {
  id: string;
}
