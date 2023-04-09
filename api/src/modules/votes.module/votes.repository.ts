import { Injectable } from '@nestjs/common';
import { DataAccessService } from '../data.module/data.service';
import {
  IPrismaCursor,
  IPrismaQuery,
} from '../data.module/models/prisma-query.model';
import { Vote, VoteDto } from './models/vote.model';
import { ISearchQueryResponse } from '../data.module/models/search-query-response.model';

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

  async search(
    filter: any,
    cursor: IPrismaCursor,
  ): Promise<ISearchQueryResponse<Vote>> {
    const query = this.buildQuery(filter, null, cursor);

    const votes = await this.dataService.vote.findMany(query);

    query.skip = undefined;
    query.take = undefined;

    const count = await this.dataService.vote.count(query);

    const response: ISearchQueryResponse<Vote> = {
      rows: votes,
      totalRows: count,
    };

    return response;
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

  async bulkUpdate(filter: any, data: Partial<Vote>): Promise<number> {
    const result = await this.dataService.vote.updateMany({
      where: filter,
      data: data,
    });

    return result.count;
  }

  private buildQuery(
    filter: any,
    fieldSelect: any = null,
    cursor: IPrismaCursor | null = null,
  ): IPrismaQuery {
    const query: IPrismaQuery = {
      where: filter,
    };

    if (!!cursor) {
      query.skip = cursor.skip;
      query.take = cursor.take;
    }

    if (!!fieldSelect) {
      query.select = fieldSelect;
    }

    return query;
  }
}
