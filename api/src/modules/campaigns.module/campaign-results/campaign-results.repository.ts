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

  async search(filter: any): Promise<CampaignResults[]> {
    const query = this.buildQuery(filter);

    const campaignResults = await this.dataService.campaignResults.findMany(
      query,
    );

    return campaignResults;
  }

  async save(dto: CampaignResultsDto): Promise<CampaignResults> {
    const candidateResults =
      dto.candidateResults?.map((result) => ({
        id: result.id,
        voteCount: result.voteCount,
        candidateId: result.candidateId,
      })) ?? [];

    const result = await this.dataService.campaignResults.upsert({
      where: {
        campaignId: dto.campaignId,
      },
      create: {
        campaignId: dto.campaignId,
        totalVoteCount: dto.totalVoteCount,
        candidateResults: {
          createMany: {
            data: candidateResults,
          },
        },
      },
      update: {
        totalVoteCount: dto.totalVoteCount,
        candidateResults: {
          deleteMany: {},
          createMany: {
            data: candidateResults,
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
