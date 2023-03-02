import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from '@nestjs/common/decorators';
import { response } from 'express';
import { WithCredentials } from 'src/services/auth/guards/guard-activators.decorator';
import { CampaignsService } from 'src/services/campaigns/campaigns.service';
import { CampaignDto } from 'src/services/campaigns/models/campaign.dto';
import { IAuthenticatedRequest } from '../auth/models/auth-contracts.model';
import { CampaignCreateHandler } from './handlers/campaign-create.handler';
import { CampaignSearchHandler } from './handlers/campaign-search.handler';
import {
  ICampaignCreateRequest,
  ICampaignCreateResponse,
  ICampaignSearchRequest,
  ICampaignSearchResponse,
} from './models/campaign-search-contracts.model';

@Controller('campaigns')
export class CampaignsController {
  constructor(
    private readonly campaignService: CampaignsService,
    private readonly campaignSearchHandler: CampaignSearchHandler,
    private readonly campaignCreateHandler: CampaignCreateHandler,
  ) {}

  @Get(':id')
  async get(@Param('id') id: string): Promise<CampaignDto> {
    const campaign = await this.campaignService.get(id);

    if (!campaign) {
      throw new NotFoundException();
    }

    const dto = CampaignDto.map(campaign);

    return dto;
  }

  @Post()
  async create(
    @Request() request: IAuthenticatedRequest,
    @Body() body: ICampaignCreateRequest,
  ): Promise<ICampaignCreateResponse> {
    const response = await this.campaignCreateHandler.handle(
      request.user,
      body,
    );

    return response;
  }

  @Post('search')
  async search(
    @Body() request: ICampaignSearchRequest,
  ): Promise<ICampaignSearchResponse> {
    const response = await this.campaignSearchHandler.handle(request);

    return response;
  }
}
