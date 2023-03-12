import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { IAuthenticatedRequest } from 'src/modules/auth.module/routes/models/auth-contracts.model';
import { CampaignsService } from 'src/modules/campaigns.module/campaigns.service';
import { CampaignDto } from 'src/modules/campaigns.module/models/campaign.dto';
import { CampaignCreateHandler } from './handlers/campaign-create.handler';
import { CampaignUpdateHandler } from './handlers/campaign-update.handler';
import { CampaignSearchHandler } from './handlers/campaign-search.handler';
import {
  ICampaignCreateRequest,
  ICampaignCreateResponse,
  ICampaignSaveRequest,
  ICampaignSaveResponse,
  ICampaignSearchRequest,
  ICampaignSearchResponse,
} from './models/campaign-contracts.model';

@Controller('campaigns')
export class CampaignsController {
  constructor(
    private readonly campaignService: CampaignsService,
    private readonly campaignSearchHandler: CampaignSearchHandler,
    private readonly campaignCreateHandler: CampaignCreateHandler,
    private readonly campaignSaveHandler: CampaignUpdateHandler,
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

    if (this.campaignService.isReadAccessDenied(user, campaign)) {
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

  @Put()
  async save(
    @Body() body: ICampaignSaveRequest,
    @Request() request: IAuthenticatedRequest,
  ): Promise<ICampaignSaveResponse> {
    const user = request.user;

    const response = await this.campaignSaveHandler.handle(user, body);

    return response;
  }

  @Post('search')
  async search(
    @Body() body: ICampaignSearchRequest,
    @Request() request: IAuthenticatedRequest,
  ): Promise<ICampaignSearchResponse> {
    const user = request.user;

    const response = await this.campaignSearchHandler.handle(user, body);

    return response;
  }
}
