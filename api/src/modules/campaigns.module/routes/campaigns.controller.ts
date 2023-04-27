import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
import { CampaignDto } from 'src/modules/campaigns.module/models/campaign/campaign.dto';
import { CampaignCreateHandler } from './handlers/campaign-create.handler';
import { CampaignUpdateHandler } from './handlers/campaign-update.handler';
import { CampaignSearchHandler } from './handlers/campaign-search.handler';
import {
  ICampaignCreateRequest,
  ICampaignCreateResponse,
  ICampaignPubKeySaveRequest,
  ICampaignPubKeySaveResponse,
  ICampaignSaveRequest,
  ICampaignSaveResponse,
  ICampaignSearchRequest,
  ICampaignSearchResponse,
  ICampaignStartResponse,
  ICampaignStopResponse,
} from './models/campaign-contracts.model';
import { CampaignVotingControlHandler } from './handlers/campaign-voting-control.handler';

@Controller('campaigns')
export class CampaignsController {
  constructor(
    private readonly campaignService: CampaignsService,
    private readonly campaignSearchHandler: CampaignSearchHandler,
    private readonly campaignCreateHandler: CampaignCreateHandler,
    private readonly campaignUpdateHandler: CampaignUpdateHandler,
    private readonly campaignVotingControlHandler: CampaignVotingControlHandler,
  ) {}

  @Get(':id')
  async get(
    @Param('id') id: string,
    @Request() request: IAuthenticatedRequest,
  ): Promise<CampaignDto> {
    const campaign = await this.campaignService.get(id);

    if (!campaign || !!campaign.deleteDate) {
      throw new NotFoundException();
    }

    const user = request.user;

    if (!this.campaignService.hasReadAccess(user, campaign)) {
      throw new ForbiddenException();
    }

    const dto = CampaignDto.map(campaign, true);

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

    const response = await this.campaignUpdateHandler.handle(user, body);

    return response;
  }

  @Post(':id/pubkey')
  async savePubKey(
    @Param('id') id: string,
    @Body() body: ICampaignPubKeySaveRequest,
    @Request() request: IAuthenticatedRequest,
  ): Promise<ICampaignPubKeySaveResponse> {
    const campaign = await this.campaignService.get(id);

    if (!campaign || !!campaign.deleteDate) {
      throw new NotFoundException(`Campaign not found by id: ${id}`);
    }

    const user = request.user;

    if (!this.campaignService.hasWriteAccess(user, campaign)) {
      throw new ForbiddenException();
    }

    if (!!campaign.pubKey) {
      throw new BadRequestException('Campaign already has a public key');
    }

    const dto = CampaignDto.map(campaign);

    dto.pubKey = body.pubKey;

    const result = await this.campaignService.update(dto);

    const response: ICampaignPubKeySaveResponse = {
      pubKey: result.pubKey!,
    };

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

  @Post(':id/start')
  async startVoting(
    @Param('id') id: string,
    @Request() request: IAuthenticatedRequest,
  ): Promise<ICampaignStartResponse> {
    const user = request.user;

    return this.campaignVotingControlHandler.handleStartVoting(user, id);
  }

  @Post(':id/stop')
  async stopVoting(
    @Param('id') id: string,
    @Request() request: IAuthenticatedRequest,
  ): Promise<ICampaignStopResponse> {
    const user = request.user;

    return this.campaignVotingControlHandler.handleStopVoting(user, id);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Request() request: IAuthenticatedRequest,
  ): Promise<void> {
    const user = request.user;

    const campaign = await this.campaignService.get(id);

    if (!campaign) {
      throw new NotFoundException(`Campaign not found by id ${id}`);
    }

    if (!this.campaignService.hasWriteAccess(user, campaign)) {
      throw new ForbiddenException();
    }

    if (!!campaign.deleteDate) {
      return;
    }

    campaign.deleteDate = new Date();

    const dto = CampaignDto.map(campaign, true);

    const res = await this.campaignService.update(dto);

    return;
  }
}
