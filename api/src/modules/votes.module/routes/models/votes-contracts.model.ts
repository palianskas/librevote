import { VoteDto } from '../../models/vote.model';

export interface IVoteCastRequest {
  dto: VoteDto;
}

export interface IVoteCastResponse {
  id: string;
}

export interface IVoteSearchRequest {
  campaignId: string;
  page: number;
}

export interface IVoteSearchResponse {
  rows: VoteDto[];
  totalRows: number;
}

export interface IVoteCountSearchResponse {
  count: number;
}

export interface IPublicVotingStatusResponse {
  campaignId: string;
  isAcceptingVotes: boolean;
}

export interface IVotesInvalidationRequest {
  campaignId: string;
  voteIds: string[];
}

export interface IVotesInvalidationResponse {
  count: number;
}
