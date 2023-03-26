import { Injectable } from '@nestjs/common';
import { Vote, VoteDto } from './models/vote.model';
import { VotesRepository } from './votes.repository';

@Injectable()
export class VotesService {
  constructor(private readonly votesRepository: VotesRepository) {}

  async get(id: string): Promise<Vote | null> {
    const user = this.votesRepository.get(id);

    return user;
  }

  async create(dto: VoteDto): Promise<Vote> {
    return this.votesRepository.create(dto);
  }

  async search(filter: any): Promise<Vote[]> {
    return this.votesRepository.search(filter);
  }
}
