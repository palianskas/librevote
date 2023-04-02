import { VoteDto } from './vote.model';

export interface IVoteCreateRequest {
  dto: VoteDto;
}

export interface IVoteCreateResponse {
  id: string;
}

export interface IVoteSearchRequest {
  campaignId: string;
}

export interface IVoteSearchResponse {
  rows: VoteDto[];
}

export interface IVoteCountSearchResponse {
  count: number;
}
