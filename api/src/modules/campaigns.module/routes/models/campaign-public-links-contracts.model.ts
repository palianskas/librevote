import { CampaignPublicLinkDto } from '../../models/campaign-public-link/campaign-public-link.dto';

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
