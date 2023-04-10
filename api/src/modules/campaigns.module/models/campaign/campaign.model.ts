import { Campaign as CampaignEntity } from '@prisma/client';
import { CampaignCandidate } from '../campaign-candidate/campaign-candidate.model';
import { CampaignPublicLink } from '../campaign-public-link/campaign-public-link.model';
import { CampaignSettings } from '../campaign-settings/campaign-settings.model';
import { CampaignUser } from '../campaign-user/campaign-user.model';
import { CampaignResults } from '../campaign-results/campaign-results.model';

export type Campaign = CampaignEntity & {
  campaignUsers?: CampaignUser[];
  publicLinks?: CampaignPublicLink[];
  candidates?: CampaignCandidate[];
  settings?: CampaignSettings | null;
  results?: CampaignResults | null;
};
