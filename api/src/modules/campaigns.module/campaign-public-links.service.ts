import { Injectable } from '@nestjs/common';
import { CampaignPublicLink, User } from '@prisma/client';
import { CampaignPublicLinksRepository } from './campaign-public-links.repository';
import { CampaignPublicLinkDto } from './models/campaign-public-link.dto';

@Injectable()
export class CampaignPublicLinksService {
  constructor(
    private readonly campaignPublicLinksRepository: CampaignPublicLinksRepository,
  ) {}

  async get(id: string): Promise<CampaignPublicLink | null> {
    const campaign = await this.campaignPublicLinksRepository.get(id);

    return campaign;
  }

  async create(dto: CampaignPublicLinkDto): Promise<CampaignPublicLink> {
    const campaign = this.campaignPublicLinksRepository.create(dto);

    return campaign;
  }
}
