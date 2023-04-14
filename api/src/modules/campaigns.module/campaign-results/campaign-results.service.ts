import { Injectable } from '@nestjs/common';
import { CampaignResults } from '@prisma/client';
import { CampaignResultsDto } from '../models/campaign-results/campaign-results.dto';
import { CampaignResultsRepository } from './campaign-results.repository';

@Injectable()
export class CampaignResultsService {
  constructor(
    private readonly campaignResultsRepository: CampaignResultsRepository,
  ) {}

  async get(id: string): Promise<CampaignResults | null> {
    const campaignResults = await this.campaignResultsRepository.get(id);

    return campaignResults;
  }

  async getByCampaign(campaignId: string): Promise<CampaignResults | null> {
    const filter = {
      campaignId: campaignId,
    };

    const campaignResults = await this.campaignResultsRepository.search(filter);

    return campaignResults.length > 0 ? campaignResults[0] : null;
  }

  async save(dto: CampaignResultsDto): Promise<string> {
    const campaignResults = await this.campaignResultsRepository.save(dto);

    return campaignResults.id;
  }
}
