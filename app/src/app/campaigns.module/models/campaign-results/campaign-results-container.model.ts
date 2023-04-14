import { CampaignResults } from './campaign-results.model';

export class CampaignResultsContainer {
  isCountSuccessful: boolean;
  results?: CampaignResults;
  failureStatus?: CampaignVoteCountFailureStatus;
}

export enum CampaignVoteCountFailureStatus {
  KeyPairMismatch,
  InvalidVotesDetected,
  Other,
}
