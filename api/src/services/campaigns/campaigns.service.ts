import { Injectable } from '@nestjs/common';
import { CampaignsRepository } from './campaigns.repository';
import { CampaignDto } from './models/campaign.dto';
import { Campaign } from './models/campaign.model';

@Injectable()
export class CampaignsService {
  constructor(private readonly campaignRepository: CampaignsRepository) {}

  async get(id: string): Promise<Campaign | null> {
    const campaign = this.campaignRepository.get(id);

    return campaign;
  }

  async create(dto: CampaignDto): Promise<Campaign> {
    const campaign = this.campaignRepository.create(dto);

    return campaign;
  }
}
