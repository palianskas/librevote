import { Injectable } from '@nestjs/common';
import { DataAccessService } from 'src/modules/data.module/data.service';
import { IPrismaQuery } from 'src/modules/data.module/models/prisma-query.model';
import { CampaignUserDto } from '../models/campaign-user.dto';
import { CampaignUser } from '../models/campaign-user.model';

@Injectable()
export class CampaignUsersRepository {
  constructor(private readonly dataService: DataAccessService) {}

  async get(id: string): Promise<CampaignUser | null> {
    const filter = {
      id: id,
    };

    const query = this.buildQuery(filter);

    const campaignUser = await this.dataService.campaignUser.findFirst(query);

    return campaignUser;
  }

  async search(filter: any, fieldSelect: any = null): Promise<CampaignUser[]> {
    const query = this.buildQuery(filter, fieldSelect);

    const campaigns = await this.dataService.campaignUser.findMany(query);

    return campaigns;
  }

  async create(dto: CampaignUserDto): Promise<CampaignUser> {
    const result = await this.dataService.campaignUser.create({
      data: {
        userId: dto.userId,
        campaignId: dto.campaignId!,
        role: dto.role,
      },
      include: {
        campaign: true,
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
      query.include = {
        campaign: true,
      };
    }

    return query;
  }
}
