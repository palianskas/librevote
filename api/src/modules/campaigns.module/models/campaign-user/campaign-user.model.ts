import { CampaignUser as CampaignUserEntity, User } from '@prisma/client';
import { Campaign } from '../campaign/campaign.model';

export type CampaignUser = CampaignUserEntity & {
  campaign?: Campaign;
  user?: User;
};
