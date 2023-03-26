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
  ICampaignSaveRequest as ICampaignUpdateRequest,
  ICampaignSaveResponse as ICampaignUpdateResponse,
} from '../models/campaign-contracts.model';

@Injectable()
export class CampaignUpdateHandler {
  constructor(private readonly campaignsService: CampaignsService) {}

  async handle(
    user: User,
    request: ICampaignUpdateRequest,
  ): Promise<ICampaignUpdateResponse> {
    const dto = request.dto;

    const entity = await this.fetchEntity(dto);

    this.validateRequest(user, entity);

    const campaign = await this.campaignsService.update(dto);

    const response: ICampaignUpdateResponse = {
      dto: CampaignDto.map(campaign, true),
    };

    return response;
  }

  private validateRequest(user: User, entity: Campaign): void {
    if (!this.campaignsService.hasWriteAccess(user, entity)) {
      throw new ForbiddenException();
    }

    if (this.campaignsService.isEditDisabled(entity)) {
      throw new BadRequestException('This campaign cannot be edited');
    }
  }

  private async fetchEntity(dto: CampaignDto): Promise<Campaign> {
    if (!dto.id) {
      throw new BadRequestException('Campaign id not specified');
    }

    const entity = await this.campaignsService.get(dto.id);

    if (!entity) {
      throw new NotFoundException(`Campaign not found by id: ${dto.id}`);
    }

    return entity;
  }
}
