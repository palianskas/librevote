import { Injectable } from '@nestjs/common';
import { DataAccessService } from 'src/services/data/data.service';
import { CampaignDto } from './models/campaign.dto';
import { Campaign } from './models/campaign.model';

@Injectable()
export class CampaignsRepository {
  constructor(private readonly dataService: DataAccessService) {}

  async get(id: string): Promise<Campaign | null> {
    const filter = {
      id: id,
    };

    const campaign = await this.dataService.campaign.findFirst({
      where: filter,
      include: {
        campaignUsers: true,
      },
    });

    return campaign;
  }

  async getMany(filter: any): Promise<Campaign[]> {
    const campaigns = await this.dataService.campaign.findMany({
      where: filter,
      include: {
        campaignUsers: true,
      },
    });

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
        campaignUsers: {
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
}
