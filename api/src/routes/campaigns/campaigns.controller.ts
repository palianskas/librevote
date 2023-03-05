import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CampaignsService } from 'src/services/campaigns/campaigns.service';
import { CampaignDto } from 'src/services/campaigns/models/campaign.dto';
import { OperationalContextService } from 'src/services/core/operational-context/operational-context.service';
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
    private readonly operationalContextService: OperationalContextService,
  ) {}

  @Get(':id')
  async get(@Param('id') id: string): Promise<CampaignDto> {
    const campaign = await this.campaignService.get(id);

    if (!campaign) {
      throw new NotFoundException();
    }

    const user = this.operationalContextService.context.user;

    if (this.campaignService.isAccessDeniedToCampaign(user, campaign)) {
      throw new ForbiddenException();
    }
    const dto = CampaignDto.map(campaign);

    return dto;
  }

  @Post()
  async create(
    @Body() body: ICampaignCreateRequest,
  ): Promise<ICampaignCreateResponse> {
    const user = this.operationalContextService.context.user;

    const response = await this.campaignCreateHandler.handle(user, body);

    return response;
  }

  @Post('search')
  async search(
    @Body() body: ICampaignSearchRequest,
  ): Promise<ICampaignSearchResponse> {
    const user = this.operationalContextService.context.user;

    const response = await this.campaignSearchHandler.handle(body);

    if (this.campaignService.isAccessesDeniedToCampaigns(user, response.rows)) {
      throw new ForbiddenException();
    }

    return response;
  }
}
