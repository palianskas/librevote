import { Injectable } from '@nestjs/common';
import { CampaignPublicLink } from '@prisma/client';
import { CampaignPublicLinksRepository } from './campaign-public-links.repository';
import { CampaignPublicLinkDto } from './models/campaign-public-link/campaign-public-link.dto';

@Injectable()
export class CampaignPublicLinksService {
  constructor(
    private readonly campaignPublicLinksRepository: CampaignPublicLinksRepository,
  ) {}

  async get(id: string): Promise<CampaignPublicLink | null> {
    const campaignPublicLink = await this.campaignPublicLinksRepository.get(id);

    return campaignPublicLink;
  }

  async getByLink(link: string): Promise<CampaignPublicLink | null> {
    const campaignPublicLink =
      await this.campaignPublicLinksRepository.getByLink(link);

    return campaignPublicLink;
  }

  async create(dto: CampaignPublicLinkDto): Promise<string> {
    const campaignPublicLink = await this.campaignPublicLinksRepository.create(
      dto,
    );

    return campaignPublicLink.id;
  }
}
