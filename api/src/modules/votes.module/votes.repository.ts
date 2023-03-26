import { Injectable } from '@nestjs/common';
import { DataAccessService } from '../data.module/data.service';
import { IPrismaQuery } from '../data.module/models/prisma-query.model';
import { Vote, VoteDto } from './models/vote.model';

@Injectable()
export class VotesRepository {
  constructor(private readonly dataService: DataAccessService) {}

  async get(id: string): Promise<Vote | null> {
    const filter = {
      id: id,
    };

    const query = this.buildQuery(filter);

    const vote = await this.dataService.vote.findFirst(query);

    return vote;
  }

  async search(filter: any): Promise<Vote[]> {
    const query = this.buildQuery(filter);

    const votes = await this.dataService.vote.findMany(query);

    return votes;
  }

  async create(dto: VoteDto): Promise<Vote> {
    const result = await this.dataService.vote.create({
      data: {
        campaignId: dto.campaignId,
        value: dto.value,
        voucherId: dto.voucherId,
        createDate: dto.createDate,
      },
    });

    return result;
  }

  private buildQuery(filter: any, fieldSelect: any = null): IPrismaQuery {
    const query: IPrismaQuery = {
      where: filter,
    };

    if (!!fieldSelect) {
      query.select = fieldSelect;
    } else {
      query.include = {};
    }

    return query;
  }
}
