import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CampaignsService } from 'src/modules/campaigns.module/campaigns.service';
import { CampaignDto } from 'src/modules/campaigns.module/models/campaign/campaign.dto';
import { Campaign } from '../../models/campaign/campaign.model';
import {
  ICampaignStartResponse,
  ICampaignStopResponse,
} from '../models/campaign-contracts.model';

@Injectable()
export class CampaignVotingControlHandler {
  constructor(private readonly campaignsService: CampaignsService) {}

  async handleStartVoting(
    user: User,
    campaignId: string,
  ): Promise<ICampaignStartResponse> {
    const entity = await this.fetchEntity(campaignId);

    this.validateRequest(user, entity);

    if (!!entity.startDate) {
      const response: ICampaignStartResponse = {
        campaignId: campaignId,
        startDate: entity.startDate,
      };

      return response;
    }

    entity.startDate = new Date();

    const dto = CampaignDto.map(entity, true);

    const campaign = await this.campaignsService.update(dto);

    const response: ICampaignStartResponse = {
      campaignId: campaign.id,
      startDate: entity.startDate,
    };

    return response;
  }

  async handleStopVoting(
    user: User,
    campaignId: string,
  ): Promise<ICampaignStopResponse> {
    const entity = await this.fetchEntity(campaignId);

    this.validateRequest(user, entity);

    if (!!entity.endDate) {
      const response: ICampaignStopResponse = {
        campaignId: campaignId,
        endDate: entity.endDate,
      };

      return response;
    }

    entity.endDate = new Date();

    const dto = CampaignDto.map(entity, true);

    const campaign = await this.campaignsService.update(dto);

    const response: ICampaignStopResponse = {
      campaignId: campaign.id,
      endDate: entity.endDate,
    };

    return response;
  }

  private validateRequest(user: User, entity: Campaign): void {
    if (!this.campaignsService.hasWriteAccess(user, entity)) {
      throw new ForbiddenException();
    }

    if (!entity.settings?.isManualVoteStartEndEnabled) {
      throw new BadRequestException(
        `Voting for campaign ${entity.id} cannot be manually controlled`,
      );
    }
  }

  private async fetchEntity(id: string): Promise<Campaign> {
    const entity = await this.campaignsService.get(id);

    if (!entity) {
      throw new NotFoundException(`Campaign not found by id: ${id}`);
    }

    return entity;
  }
}
