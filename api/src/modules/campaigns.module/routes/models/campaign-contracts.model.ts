import { CampaignDto } from 'src/modules/campaigns.module/models/campaign.dto';

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

export interface ICampaignSaveRequest {
  dto: CampaignDto;
}
export interface ICampaignSaveResponse {
  dto: CampaignDto;
}
