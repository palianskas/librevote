import { VoteDto } from './vote.model';

export interface IVoteCreateRequest {
  dto: VoteDto;
}

export interface IVoteCreateResponse {
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
