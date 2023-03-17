import { Injectable } from '@nestjs/common';
import { CampaignCandidate } from '@prisma/client';
import { CampaignCandidateDto } from '../models/campaign-candidate/campaign-candidate.dto';
import { CampaignCandidatesRepository } from './campaign-candidates.repository';

@Injectable()
export class CampaignCandidatesService {
  constructor(
    private readonly campaignCandidatesRepository: CampaignCandidatesRepository,
  ) {}

  async get(id: string): Promise<CampaignCandidate | null> {
    const campaignCandidate = await this.campaignCandidatesRepository.get(id);

    return campaignCandidate;
  }

  async create(dto: CampaignCandidateDto): Promise<string> {
    const campaignCandidate = await this.campaignCandidatesRepository.create(
      dto,
    );

    return campaignCandidate.id;
  }

  // async update(dto: CampaignCandidateDto): Promise<CampaignCandidate> {
  //   const campaignCandidate = await this.campaignCandidatesRepository.update(
  //     dto,
  //   );

  //   return campaignCandidate;
  // }
}
