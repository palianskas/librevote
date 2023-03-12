import { Campaign as CampaignEntity } from '@prisma/client';
import { CampaignUser } from '../campaign-user/campaign-user.model';

export type Campaign = CampaignEntity & {
  campaignUsers?: CampaignUser[];
};
