import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CampaignsService } from 'src/modules/campaigns.module/campaigns.service';
import { CampaignUserRole } from 'src/modules/campaigns.module/models/campaign-user/campaign-user-role.enum';
import { CampaignDto } from 'src/modules/campaigns.module/models/campaign/campaign.dto';
import { CampaignSettingsDto } from '../../models/campaign-settings/campaign-settings.model';
import {
  ICampaignCreateRequest,
  ICampaignCreateResponse,
} from '../models/campaign-contracts.model';

@Injectable()
export class CampaignCreateHandler {
  constructor(private readonly campaignsService: CampaignsService) {}

  async handle(
    user: User,
    request: ICampaignCreateRequest,
  ): Promise<ICampaignCreateResponse> {
    this.validateRequest(request);

    const dto = request.dto;

    this.ensureCreatorIsAdmin(user, dto);

    this.ensureSettingsPresent(dto);

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

  private ensureSettingsPresent(dto: CampaignDto): void {
    if (!dto.settings) {
      dto.settings = CampaignSettingsDto.default;
    }
  }

  private validateRequest(request: ICampaignCreateRequest): boolean {
    const dto = request.dto;

    const isDateOverlap =
      !!dto.startDate && !!dto.endDate && dto.startDate >= dto.endDate;

    return isDateOverlap;
  }
}
