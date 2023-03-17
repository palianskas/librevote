import { Injectable } from '@nestjs/common';
import { DataAccessService } from '../../data.module/data.service';
import { IPrismaQuery } from '../../data.module/models/prisma-query.model';
import { CampaignCandidateDto } from '../models/campaign-candidate/campaign-candidate.dto';
import { CampaignCandidate } from '../models/campaign-candidate/campaign-candidate.model';

@Injectable()
export class CampaignCandidatesRepository {
  constructor(private readonly dataService: DataAccessService) {}

  async get(id: string): Promise<CampaignCandidate | null> {
    const filter = {
      id: id,
    };

    const query = this.buildQuery(filter);

    const campaignCandidate =
      await this.dataService.campaignCandidate.findFirst(query);

    return campaignCandidate;
  }

  async create(dto: CampaignCandidateDto): Promise<CampaignCandidate> {
    const result = await this.dataService.campaignCandidate.create({
      data: {
        campaignId: dto.campaignId,
        name: dto.name,
        description: dto.description,
        imageFileId: dto.imageFileId,
      },
      include: {
        campaign: true,
      },
    });

    return result;
  }

  // async update(dto: CampaignCandidateDto): Promise<CampaignCandidate> {
  //   const result = await this.dataService.campaignCandidate.update({
  //     where: {
  //       id: dto.id,
  //     },
  //     data: {
  //        // ...
  //     },
  //   });

  //   return result;
  // }

  private buildQuery(filter: any, fieldSelect: any = null): IPrismaQuery {
    const query: IPrismaQuery = {
      where: filter,
      include: {
        campaign: true,
      },
    };

    return query;
  }
}
