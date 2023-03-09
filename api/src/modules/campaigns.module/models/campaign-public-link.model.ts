import { CampaignPublicLink as CampaignPublicLinkEntity } from '@prisma/client';
import { Campaign } from './campaign.model';

export type CampaignPublicLink = CampaignPublicLinkEntity & {
  campaign?: Campaign;
};
