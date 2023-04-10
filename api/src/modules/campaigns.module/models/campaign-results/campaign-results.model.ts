import { CampaignResults as CampaignResultsEntity } from '@prisma/client';
import { Campaign } from '../campaign/campaign.model';
import { CandidateResults } from './candidate-results/candidate-results.model';

export type CampaignResults = CampaignResultsEntity & {
  campaign?: Campaign;
  candidateResults?: CandidateResults[];
};
