import { Injectable } from '@nestjs/common';
import { DataAccessService } from '../data.module/data.service';
import { IPrismaQuery } from '../data.module/models/prisma-query.model';
import { CampaignDto } from './models/campaign/campaign.dto';
import { Campaign } from './models/campaign/campaign.model';

@Injectable()
export class CampaignsRepository {
  constructor(private readonly dataService: DataAccessService) {}

  async get(id: string): Promise<Campaign | null> {
    const filter = {
      id: id,
    };

    const query = this.buildQuery(filter);

    const campaign = await this.dataService.campaign.findFirst(query);

    return campaign;
  }

  async search(filter: any, fieldSelect: any = null): Promise<Campaign[]> {
    const query = this.buildQuery(filter, fieldSelect);

    const campaigns = await this.dataService.campaign.findMany(query);

    return campaigns;
  }

  async create(dto: CampaignDto): Promise<Campaign> {
    const campaignUsers = dto.campaignUsers.map((userDto) => ({
      role: userDto.role,
      userId: userDto.userId,
    }));

    const result = await this.dataService.campaign.create({
      data: {
        name: dto.name,
        pubKey: dto.pubKey,
        startDate: dto.startDate,
        endDate: dto.endDate,
        campaignUsers: {
          createMany: {
            data: campaignUsers,
          },
        },
      },
    });

    return result;
  }

  async update(dto: CampaignDto): Promise<Campaign> {
    const campaignUsers = dto.campaignUsers.map((userDto) => ({
      role: userDto.role,
      userId: userDto.userId,
    }));

    const result = await this.dataService.campaign.update({
      where: {
        id: dto.id,
      },
      data: {
        name: dto.name,
        pubKey: dto.pubKey,
        startDate: dto.startDate,
        endDate: dto.endDate,
        campaignUsers: {
          deleteMany: {},
          createMany: {
            data: campaignUsers,
          },
        },
      },
      include: {
        campaignUsers: true,
      },
    });

    return result;
  }

  // TODO: `QueryBuilder` and `QueryBuilderFactory` ?
  private buildQuery(filter: any, fieldSelect: any = null): IPrismaQuery {
    const query: IPrismaQuery = {
      where: filter,
    };

    if (!!fieldSelect) {
      query.select = fieldSelect;
    } else {
      query.include = {
        campaignUsers: {
          include: {
            user: true,
          },
        },
        publicLinks: true,
        candidates: true,
      };
    }

    return query;
  }
}
