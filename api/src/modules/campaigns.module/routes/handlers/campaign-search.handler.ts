import { Injectable } from '@nestjs/common';
import { CampaignUsersRepository } from 'src/modules/campaigns.module/campaign-users/campaign-users.repository';
import { CampaignsRepository } from 'src/modules/campaigns.module/campaigns.repository';
import { CampaignDto } from 'src/modules/campaigns.module/models/campaign.dto';
import {
  ICampaignSearchRequest,
  ICampaignSearchResponse,
} from '../models/campaign-search-contracts.model';

@Injectable()
export class CampaignSearchHandler {
  constructor(
    private readonly campaignsRepository: CampaignsRepository,
    private readonly campaignUsersRepository: CampaignUsersRepository,
  ) {}

  async handle(
    request: ICampaignSearchRequest,
  ): Promise<ICampaignSearchResponse> {
    const filter = {
      id: {
        in: [] as string[],
      },
    };

    if (!!request.userIds) {
      const userCampaignsIds = await this.getUsersCampaignIds(request.userIds);

      filter.id.in = userCampaignsIds;
    }

    if (!!request.campaignIds) {
      filter.id.in.concat(request.campaignIds);
    }

    const campaigns = await this.campaignsRepository.search(filter);

    const dtos = campaigns.map((campaign) => CampaignDto.map(campaign));

    const response: ICampaignSearchResponse = {
      rows: dtos,
    };

    return response;
  }

  private async getUsersCampaignIds(userIds: string[]): Promise<string[]> {
    const filter = {
      userId: {
        in: userIds,
      },
    };

    const fieldSelect = {
      campaignId: true,
    };

    const campaignUsers = await this.campaignUsersRepository.search(
      filter,
      fieldSelect,
    );

    const campaignIds = campaignUsers.map((user) => user.campaignId);

    return campaignIds;
  }
}
