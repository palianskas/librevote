import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/modules/auth.module/routes/models/auth-contracts.model';
import { CampaignsService } from 'src/modules/campaigns.module/campaigns.service';
import { CampaignDto } from 'src/modules/campaigns.module/models/campaign.dto';
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
  async get(
    @Param('id') id: string,
    @Request() request: IAuthenticatedRequest,
  ): Promise<CampaignDto> {
    const campaign = await this.campaignService.get(id);

    if (!campaign) {
      throw new NotFoundException();
    }

    const user = request.user;

    if (this.campaignService.isAccessDeniedToCampaign(user, campaign)) {
      throw new ForbiddenException();
    }
    const dto = CampaignDto.map(campaign);

    return dto;
  }

  @Post()
  async create(
    @Body() body: ICampaignCreateRequest,
    @Request() request: IAuthenticatedRequest,
  ): Promise<ICampaignCreateResponse> {
    const user = request.user;

    const response = await this.campaignCreateHandler.handle(user, body);

    return response;
  }

  @Post('search')
  async search(
    @Body() body: ICampaignSearchRequest,
    @Request() request: IAuthenticatedRequest,
  ): Promise<ICampaignSearchResponse> {
    const user = request.user;

    const response = await this.campaignSearchHandler.handle(body);

    if (this.campaignService.isAccessesDeniedToCampaigns(user, response.rows)) {
      throw new ForbiddenException();
    }

    return response;
  }
}
