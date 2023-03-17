import { CampaignCandidate as CampaignCandidateEntity } from '@prisma/client';
import { Campaign } from '../campaign/campaign.model';

export type CampaignCandidate = CampaignCandidateEntity & {
  campaign?: Campaign;
};
