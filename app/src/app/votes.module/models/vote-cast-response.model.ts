import { VoteCastError } from './vote-cast-error.enum';

export class VoteCastResponse {
  isSuccessful: boolean;
  voteId?: string;
  error?: VoteCastError;
}
