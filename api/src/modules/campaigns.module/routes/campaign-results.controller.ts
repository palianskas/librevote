import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CampaignResultsService } from '../campaign-results/campaign-results.service';
import {
  ICampaignResultsSaveRequest,
  ICampaignResultsSaveResponse,
} from './models/campaign-results-contracts.model';
import { CampaignResultsDto } from '../models/campaign-results/campaign-results.dto';
import { CampaignsService } from '../campaigns.service';
import { IAuthenticatedRequest } from 'src/modules/auth.module/routes/models/auth-contracts.model';
import { User } from '@prisma/client';

@Controller('campaign-results')
export class CampaignResultsController {
  constructor(
    private readonly campaignResultsService: CampaignResultsService,
    private readonly campaignsService: CampaignsService,
  ) {}

  @Get(':id')
  async get(@Param('id') id: string): Promise<CampaignResultsDto> {
    const campaignResults = await this.campaignResultsService.get(id);

    if (!campaignResults) {
      throw new NotFoundException();
    }

    const dto = CampaignResultsDto.map(campaignResults);

    return dto;
  }

  @Post()
  async save(
    @Req() request: IAuthenticatedRequest,
    @Body() saveRequest: ICampaignResultsSaveRequest,
  ): Promise<ICampaignResultsSaveResponse> {
    const user = request.user;

    await this.validateSaveRequest(user, saveRequest);

    const dto = saveRequest.dto;

    const id = await this.campaignResultsService.save(dto);

    const response: ICampaignResultsSaveResponse = {
      id: id,
    };

    return response;
  }

  private async validateSaveRequest(
    user: User,
    request: ICampaignResultsSaveRequest,
  ): Promise<void> {
    const campaign = await this.campaignsService.get(request.dto.campaignId);

    if (!campaign) {
      throw new BadRequestException(
        'Cannot save results for non-existant campaign',
      );
    }

    if (!this.campaignsService.hasVoteManagementAccess(user, campaign)) {
      throw new ForbiddenException();
    }

    if (!!campaign.results && !request.force) {
      throw new BadRequestException(
        `Campaign ${campaign.id} already has saved results`,
      );
    }
  }
}
