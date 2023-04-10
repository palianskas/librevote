import { CandidateResults as CandidateResultsEntity } from '@prisma/client';
import { CampaignResults } from '../campaign-results.model';
import { CampaignCandidate } from '../../campaign-candidate/campaign-candidate.model';

export type CandidateResults = CandidateResultsEntity & {
  candidate?: CampaignCandidate | null;
  campaignResults?: CampaignResults | null;
};
