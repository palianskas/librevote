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

  async save(dto: CampaignResultsDto): Promise<string> {
    const campaignResults = await this.campaignResultsRepository.save(dto);

    return campaignResults.id;
  }
}
