import { Injectable } from '@nestjs/common';
import { CampaignPublicLink } from '../models/campaign-public-link/campaign-public-link.model';
import { CampaignPublicLinkDto } from '../models/campaign-public-link/campaign-public-link.dto';
import { CampaignPublicLinksRepository } from './campaign-public-links.repository';

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
    const links = await this.campaignPublicLinksRepository.getByLink(link);

    const validLink = links.find(
      (publicLink) => publicLink.campaign?.deleteDate === null, // strict check to fail on `undefined`
    );

    return validLink ?? null;
  }

  async create(dto: CampaignPublicLinkDto): Promise<string> {
    const campaignPublicLink = await this.campaignPublicLinksRepository.create(
      dto,
    );

    return campaignPublicLink.id;
  }

  async update(dto: CampaignPublicLinkDto): Promise<CampaignPublicLink> {
    const campaignPublicLink = await this.campaignPublicLinksRepository.update(
      dto,
    );

    return campaignPublicLink;
  }
}
