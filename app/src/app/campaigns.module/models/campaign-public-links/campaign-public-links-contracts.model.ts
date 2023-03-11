import { CampaignPublicLinkDto } from './campaign-public-link.model';

export interface ICampaignPublicLinkCreateRequest {
  dto: CampaignPublicLinkDto;
}
export interface ICampaignPublicLinkCreateResponse {
  id: string;
}
