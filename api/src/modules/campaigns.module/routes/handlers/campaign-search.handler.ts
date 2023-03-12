import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CampaignUsersRepository } from 'src/modules/campaigns.module/campaign-users/campaign-users.repository';
import { CampaignsRepository } from 'src/modules/campaigns.module/campaigns.repository';
import { CampaignDto } from 'src/modules/campaigns.module/models/campaign/campaign.dto';
import {
  ICampaignSearchRequest,
  ICampaignSearchResponse,
} from '../models/campaign-contracts.model';

@Injectable()
export class CampaignSearchHandler {
  constructor(
    private readonly campaignsRepository: CampaignsRepository,
    private readonly campaignUsersRepository: CampaignUsersRepository,
  ) {}

  async handle(
    user: User,
    request: ICampaignSearchRequest,
  ): Promise<ICampaignSearchResponse> {
    // TODO: currently only allow to load own campaigns
    request.userIds = [user.id];

    const filter = this.buildSearchFilter(request);

    const campaigns = await this.campaignsRepository.search(filter);

    const dtos = campaigns.map((campaign) => CampaignDto.map(campaign));

    const response: ICampaignSearchResponse = {
      rows: dtos,
    };

    return response;
  }

  private buildSearchFilter(
    request: ICampaignSearchRequest,
  ): ICampaignSearchFilter {
    const filter: ICampaignSearchFilter = {};

    if (!!request.userIds) {
      filter.campaignUsers = {
        some: {
          userId: {
            in: request.userIds,
          },
        },
      };
    }

    if (!!request.campaignIds) {
      filter.id = {
        in: request.campaignIds,
      };
    }

    return filter;
  }
}

interface ICampaignSearchFilter {
  id?: {
    in: string[];
  };
  campaignUsers?: {
    some: {
      userId: {
        in: string[];
      };
    };
  };
}
