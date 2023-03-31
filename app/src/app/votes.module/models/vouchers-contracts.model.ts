import { VotingVoucherDto } from './voting-voucher.model';

export interface IVotingVoucherCreateRequest {
  campaignId: string;
  dto: VotingVoucherDto;
}

export interface IVotingVoucherCreateResponse {
  id: string;
}

export interface IBulkVotingVoucherCreateRequest {
  campaignId: string;
  usernames: string[];
}

export interface IBulkVotingVoucherCreateResponse {
  count: number;
}
