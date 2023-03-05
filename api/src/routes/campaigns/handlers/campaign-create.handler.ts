import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CampaignsService } from 'src/services/campaigns.module/campaigns.service';
import { CampaignUserRole } from 'src/services/campaigns.module/models/campaign-user-role.enum';
import { CampaignDto } from 'src/services/campaigns.module/models/campaign.dto';
import {
  ICampaignCreateRequest,
  ICampaignCreateResponse,
} from '../models/campaign-search-contracts.model';

@Injectable()
export class CampaignCreateHandler {
  constructor(private readonly campaignsService: CampaignsService) {}

  async handle(
    user: User,
    request: ICampaignCreateRequest,
  ): Promise<ICampaignCreateResponse> {
    const dto = request.dto;

    this.ensureCreatorIsAdmin(user, dto);

    const campaign = await this.campaignsService.create(dto);

    const response: ICampaignCreateResponse = {
      id: campaign.id,
    };

    return response;
  }

  private ensureCreatorIsAdmin(user: User, dto: CampaignDto): void {
    const userCampaignUser = dto.campaignUsers.find(
      (campaignUser) => campaignUser.userId === user.id,
    );

    if (!!userCampaignUser) {
      userCampaignUser.role = CampaignUserRole.Admin;
    } else {
      dto.campaignUsers.push({
        role: CampaignUserRole.Admin,
        userId: user.id,
      });
    }
  }
}
