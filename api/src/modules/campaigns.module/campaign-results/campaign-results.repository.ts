import { Injectable } from '@nestjs/common';
import { DataAccessService } from '../../data.module/data.service';
import { IPrismaQuery } from '../../data.module/models/prisma-query.model';
import { CampaignResults } from '../models/campaign-results/campaign-results.model';
import { CampaignResultsDto } from '../models/campaign-results/campaign-results.dto';

@Injectable()
export class CampaignResultsRepository {
  constructor(private readonly dataService: DataAccessService) {}

  async get(id: string): Promise<CampaignResults | null> {
    const filter = {
      id: id,
    };

    const query = this.buildQuery(filter);

    const campaignResults = await this.dataService.campaignResults.findFirst(
      query,
    );

    return campaignResults;
  }

  async create(dto: CampaignResultsDto): Promise<CampaignResults> {
    const result = await this.dataService.campaignResults.create({
      data: {
        campaignId: dto.campaignId,
        totalVoteCount: dto.totalVoteCount,
        candidateResults: {
          createMany: {
            data: dto.candidateResults ?? [],
          },
        },
      },
      include: {
        campaign: true,
        candidateResults: {
          include: {
            candidate: true,
          },
        },
      },
    });

    return result;
  }

  private buildQuery(filter: any, fieldSelect: any = null): IPrismaQuery {
    const query: IPrismaQuery = {
      where: filter,
      include: {
        campaign: true,
        candidateResults: {
          include: {
            candidate: true,
          },
        },
      },
    };

    return query;
  }
}
