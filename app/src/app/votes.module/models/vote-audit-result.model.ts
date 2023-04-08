import { Vote } from './vote.model';

export class VoteAuditResult {
  isSuccessful: boolean;
  invalidVotes?: Vote[];
}
