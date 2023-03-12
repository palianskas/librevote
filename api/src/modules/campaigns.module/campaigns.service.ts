import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CampaignsRepository } from './campaigns.repository';
import { CampaignUserRole } from './models/campaign-user-role.enum';
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

  async update(dto: CampaignDto): Promise<Campaign> {
    const campaign = this.campaignsRepository.update(dto);

    return campaign;
  }

  isReadAccessDenied(user: User, campaign: Campaign) {
    if (!campaign.campaignUsers) {
      return true;
    }

    return !campaign.campaignUsers.some(
      (campaignUser) => campaignUser.userId === user.id,
    );
  }

  isWriteAccessDenied(user: User, campaign: Campaign) {
    if (!campaign.campaignUsers) {
      return true;
    }

    const campaignUser = campaign.campaignUsers.find(
      (campaignUser) => campaignUser.userId === user.id,
    );

    return campaignUser?.role !== CampaignUserRole.Admin;
  }
}
