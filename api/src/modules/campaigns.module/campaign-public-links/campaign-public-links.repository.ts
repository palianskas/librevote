import { Injectable } from '@nestjs/common';
import { CampaignPublicLink } from '../models/campaign-public-link/campaign-public-link.model';
import { DataAccessService } from '../../data.module/data.service';
import { IPrismaQuery } from '../../data.module/models/prisma-query.model';
import { CampaignPublicLinkDto } from '../models/campaign-public-link/campaign-public-link.dto';

@Injectable()
export class CampaignPublicLinksRepository {
  constructor(private readonly dataService: DataAccessService) {}

  async get(id: string): Promise<CampaignPublicLink | null> {
    const filter = {
      id: id,
    };

    const campaignPublicLink = await this._get(filter);

    return campaignPublicLink;
  }

  async getByLink(link: string): Promise<CampaignPublicLink | null> {
    const filter = {
      link: link,
    };

    const campaignPublicLink = await this._get(filter);

    return campaignPublicLink;
  }

  private async _get(filter: {
    id?: string;
    link?: string;
  }): Promise<CampaignPublicLink | null> {
    const query = this.buildQuery(filter);

    const campaignPublicLink =
      await this.dataService.campaignPublicLink.findFirst(query);

    return campaignPublicLink;
  }

  async create(dto: CampaignPublicLinkDto): Promise<CampaignPublicLink> {
    const result = await this.dataService.campaignPublicLink.create({
      data: {
        campaignId: dto.campaignId,
        link: dto.link,
      },
    });

    return result;
  }

  async update(dto: CampaignPublicLinkDto): Promise<CampaignPublicLink> {
    const result = await this.dataService.campaignPublicLink.update({
      where: {
        id: dto.id,
      },
      data: {
        link: dto.link,
      },
    });

    return result;
  }

  private buildQuery(filter: any, fieldSelect: any = null): IPrismaQuery {
    const query: IPrismaQuery = {
      where: filter,
      include: {
        campaign: {
          include: {
            settings: true,
            candidates: true,
          },
        },
      },
    };

    return query;
  }
}
