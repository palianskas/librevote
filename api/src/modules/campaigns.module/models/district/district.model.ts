import { District as DistrictEntity } from '@prisma/client';
import { CampaignUser } from '../campaign-user/campaign-user.model';
import { Campaign } from '../campaign/campaign.model';

export type District = DistrictEntity & {
  campaign?: Campaign;
  parentDistrict?: District;
  childDistricts?: District[];
  campaignUsers?: CampaignUser[];
};
