import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CampaignsService } from 'src/services/campaigns/campaigns.service';
import { CampaignUserRole } from 'src/services/campaigns/models/campaign-user-role.enum';
import { CampaignDto } from 'src/services/campaigns/models/campaign.dto';
import { Campaign } from 'src/services/campaigns/models/campaign.model';
import { IAuthenticatedRequest } from '../auth/models/auth-contracts.model';
import { CampaignSearchHandler } from './handlers/campaign-search.handler';
import {
  ICampaignSearchRequest,
  ICampaignSearchResponse,
} from './models/campaign-search-contracts.model';

@Controller('campaigns')
export class CampaignsController {
  constructor(
    private readonly campaignService: CampaignsService,
    private readonly campaignSearchHandler: CampaignSearchHandler,
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
  async create(@Body() dto: CampaignDto): Promise<string> {
    const campaign = await this.campaignService.create(dto);

    return campaign.id;
  }

  @Post()
  async search(
    @Body() request: ICampaignSearchRequest,
  ): Promise<ICampaignSearchResponse> {
    const response = await this.campaignSearchHandler.handle(request);

    return response;
  }
}
