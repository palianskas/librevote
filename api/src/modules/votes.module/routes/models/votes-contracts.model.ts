import { VoteDto } from '../../models/vote.model';

export interface IVoteCastRequest {
  dto: VoteDto;
}

export interface IVoteCastResponse {
  id: string;
}

export interface IVoteSearchRequest {
  campaignId: string;
}

export interface IVoteSearchResponse {
  rows: VoteDto[];
}
