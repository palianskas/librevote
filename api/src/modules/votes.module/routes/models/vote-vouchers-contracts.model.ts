import { VotingVoucherDto } from '../../models/voting-voucher.model';

export interface IVoteVoucherCreateRequest {
  campaignId: string;
  dto: VotingVoucherDto;
}

export interface IVoteVoucherCreateResponse {
  id: string;
}

export interface IBulkVoteVoucherCreateRequest {
  campaignId: string;
  usernames: string[];
}

export interface IBulkVoteVoucherCreateResponse {
  count: number;
}
