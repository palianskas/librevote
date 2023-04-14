import { CampaignResults } from './campaign-results.model';

export class CampaignResultsContainer {
  isCountSuccessful: boolean;
  results?: CampaignResults;
  failureStatus?: CampaignVoteCountFailureStatus;
  source?: ResultsSource;
}

export enum CampaignVoteCountFailureStatus {
  KeyPairMismatch,
  InvalidVotesDetected,
  Other,
}

export enum ResultsSource {
  Calculation,
  Storage,
}
