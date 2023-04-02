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
}

export interface IVoteCountSearchResponse {
  count: number;
}
