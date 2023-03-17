import { CampaignPublicLinkDto } from './campaign-public-link.model';

export interface ICampaignPublicLinkCreateRequest {
  dto: CampaignPublicLinkDto;
}
export interface ICampaignPublicLinkCreateResponse {
  id: string;
}
export interface ICampaignPublicLinkUpdateRequest {
  dto: CampaignPublicLinkDto;
}
export interface ICampaignPublicLinkUpdateResponse {
  dto: CampaignPublicLinkDto;
}
