import { VoteDto } from '../../models/vote.model';

export interface IVoteCastRequest {
  campaignId: string;
  voucherId?: string;
  vote: string;
}

export interface IVoteCastResponse {
  voteId: string;
}

export interface IVoteSearchRequest {
  campaignId: string;
}

export interface IVoteSearchResponse {
  rows: VoteDto[];
}
