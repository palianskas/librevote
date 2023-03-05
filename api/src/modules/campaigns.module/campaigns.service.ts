import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CampaignsRepository } from './campaigns.repository';
import { CampaignDto } from './models/campaign.dto';
import { Campaign } from './models/campaign.model';

@Injectable()
export class CampaignsService {
  constructor(private readonly campaignsRepository: CampaignsRepository) {}

  async get(id: string): Promise<Campaign | null> {
    const campaign = await this.campaignsRepository.get(id);

    return campaign;
  }

  async create(dto: CampaignDto): Promise<Campaign> {
    const campaign = this.campaignsRepository.create(dto);

    return campaign;
  }

  isAccessDenied(user: User, campaign: Campaign | CampaignDto) {
    if (!campaign.campaignUsers) {
      return false;
    }

    return !campaign.campaignUsers.some(
      (campaignUser) => campaignUser.userId === user.id,
    );
  }
  isAccessesDeniedToCampaigns(
    user: User,
    campaigns: (Campaign | CampaignDto)[],
  ) {
    return campaigns.some((campaign) => this.isAccessDenied(user, campaign));
  }
}
