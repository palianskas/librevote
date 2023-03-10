import { CampaignDto } from './campaign.model';

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

export interface ICampaignUpdateRequest {
  dto: CampaignDto;
}
export interface ICampaignUpdateResponse {
  dto: CampaignDto;
}
