import { Injectable } from '@nestjs/common';
import { DataAccessService } from '../data.module/data.service';
import { IPrismaQuery } from '../data.module/models/prisma-query.model';
import { Vote, VoteDto } from './models/vote.model';

@Injectable()
export class VotesRepository {
  constructor(private readonly dataService: DataAccessService) {}

  get(id: string): Promise<Vote | null> {
    const filter = {
      id: id,
    };

    const query = this.buildQuery(filter);

    return this.dataService.vote.findFirst(query);
  }

  search(filter: any): Promise<Vote[]> {
    const query = this.buildQuery(filter);

    return this.dataService.vote.findMany(query);
  }

  create(dto: VoteDto): Promise<Vote> {
    return this.dataService.vote.create({
      data: {
        campaignId: dto.campaignId,
        value: dto.value,
        voucherId: dto.voucherId,
        createDate: dto.createDate,
      },
    });
  }

  count(filter: any): Promise<number> {
    const query = this.buildQuery(filter);

    return this.dataService.vote.count(query);
  }

  private buildQuery(filter: any, fieldSelect: any = null): IPrismaQuery {
    const query: IPrismaQuery = {
      where: filter,
    };

    if (!!fieldSelect) {
      query.select = fieldSelect;
    }

    return query;
  }
}
