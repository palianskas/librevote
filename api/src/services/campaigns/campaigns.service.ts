import { Injectable } from '@nestjs/common';
import { CampaignUsersRepository } from './campaign-users/campaign-users.reposittory';
import { CampaignsRepository } from './campaigns.repository';
import { CampaignDto } from './models/campaign.dto';
import { Campaign } from './models/campaign.model';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly campaignsRepository: CampaignsRepository,
    private campaignUsersRepository: CampaignUsersRepository,
  ) {}

  async get(id: string): Promise<Campaign | null> {
    const campaign = this.campaignsRepository.get(id);

    return campaign;
  }

  async create(dto: CampaignDto): Promise<Campaign> {
    const campaign = this.campaignsRepository.create(dto);

    return campaign;
  }
}
