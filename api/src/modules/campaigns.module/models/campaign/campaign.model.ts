import { Campaign as CampaignEntity } from '@prisma/client';
import { CampaignUser } from '../campaign-user/campaign-user.model';
import { District } from '../district/district.model';

export type Campaign = CampaignEntity & {
  campaignUsers?: CampaignUser[];
  districts?: District[];
};
