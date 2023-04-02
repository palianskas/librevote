import { Injectable } from '@nestjs/common';
import { Vote, VoteDto } from './models/vote.model';
import { VotesRepository } from './votes.repository';

@Injectable()
export class VotesService {
  constructor(private readonly votesRepository: VotesRepository) {}

  get(id: string): Promise<Vote | null> {
    const vote = this.votesRepository.get(id);

    return vote;
  }

  create(dto: VoteDto): Promise<Vote> {
    return this.votesRepository.create(dto);
  }

  search(filter: any): Promise<Vote[]> {
    return this.votesRepository.search(filter);
  }
}
