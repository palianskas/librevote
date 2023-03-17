import { Campaign as CampaignEntity } from '@prisma/client';
import { CampaignPublicLink } from '../campaign-public-link/campaign-public-link.model';
import { CampaignUser } from '../campaign-user/campaign-user.model';
import { District } from '../district/district.model';

export type Campaign = CampaignEntity & {
  campaignUsers?: CampaignUser[];
  districts?: District[];
  publicLinks?: CampaignPublicLink[];
};
