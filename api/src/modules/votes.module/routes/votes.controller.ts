import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  OptionalJwt,
  Public,
} from 'src/modules/auth.module/guards/guard-activators.decorator';
import { OptionalJwtAuthGuard } from 'src/modules/auth.module/guards/optional-jwt-auth.guard';
import {
  IAuthenticatedRequest,
  IOptionalAuthenticatedRequest,
} from 'src/modules/auth.module/routes/models/auth-contracts.model';
import { CampaignsService } from 'src/modules/campaigns.module/campaigns.service';
import { VoteDto } from '../models/vote.model';
import { VotesService } from '../votes.service';
import { VoteCastHandler } from './handlers/vote-cast.handler';
import {
  IPublicVotingStatusResponse,
  IVoteCastRequest,
  IVoteCastResponse,
  IVoteCountSearchResponse,
  IVoteSearchRequest,
  IVoteSearchResponse,
  IVotesInvalidationRequest,
  IVotesInvalidationResponse,
} from './models/votes-contracts.model';

@Controller('votes')
export class VotesController {
  constructor(
    private readonly votesService: VotesService,
    private readonly voteCastHandler: VoteCastHandler,
    private readonly campaignsService: CampaignsService,
  ) {}

  @OptionalJwt()
  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async vote(
    @Req() request: IOptionalAuthenticatedRequest,
    @Body() voteCastRequest: IVoteCastRequest,
  ): Promise<IVoteCastResponse> {
    const user = request.user;

    const voteId = await this.voteCastHandler.handle(
      voteCastRequest,
      user,
      request.ip,
    );

    const response: IVoteCastResponse = {
      id: voteId,
    };

    return response;
  }

  @Get(':id')
  async get(
    @Param('id') id: string,
    @Req() request: IAuthenticatedRequest,
  ): Promise<VoteDto> {
    const vote = await this.votesService.get(id);

    if (!vote) {
      throw new NotFoundException(`Vote not found by id: ${id}`);
    }

    const campaign = await this.campaignsService.get(vote.campaignId);

    if (!campaign) {
      throw new NotFoundException(`Vote ${id} does not have a campaign`);
    }

    if (!this.campaignsService.hasVoteReadAccess(request.user, campaign)) {
      throw new ForbiddenException(
        `User does not have access to votes for campaign ${campaign.id}`,
      );
    }

    const dto = VoteDto.map(vote);

    return dto;
  }

  @Post('search')
  async search(
    @Req() request: IAuthenticatedRequest,
    @Body() searchRequest: IVoteSearchRequest,
  ): Promise<IVoteSearchResponse> {
    const campaignId = searchRequest.campaignId;

    const campaign = await this.campaignsService.get(campaignId);

    if (!campaign || !!campaign.deleteDate) {
      throw new NotFoundException(`Campaign not found by id ${campaignId}`);
    }

    if (!this.campaignsService.hasVoteReadAccess(request.user, campaign)) {
      throw new ForbiddenException(
        `User does not have access to votes for campaign ${campaign.id}`,
      );
    }

    const result = await this.votesService.getVotesForCampaign(
      campaignId,
      searchRequest.page,
    );

    const dtos = VoteDto.mapList(result.rows);

    const response: IVoteSearchResponse = {
      rows: dtos,
      totalRows: result.totalRows,
    };

    return response;
  }

  @Get(':campaignId/count')
  async count(
    @Param('campaignId') campaignId: string,
  ): Promise<IVoteCountSearchResponse> {
    const campaign = await this.campaignsService.get(campaignId);

    if (!campaign || !!campaign.deleteDate) {
      throw new NotFoundException(`Campaign not found by id ${campaignId}`);
    }

    const count = await this.votesService.getVoteCountForCampaign(campaignId);

    const response: IVoteCountSearchResponse = {
      count: count,
    };

    return response;
  }

  @Public()
  @Get(':id/status')
  async status(@Param('id') id: string): Promise<IPublicVotingStatusResponse> {
    const response = await this.votesService.status(id);

    if (!response) {
      throw new NotFoundException(`Campaign not found by id ${id}`);
    }

    return response;
  }

  @Post('invalidate')
  async invalidate(
    @Req() request: IAuthenticatedRequest,
    @Body() invalidationRequest: IVotesInvalidationRequest,
  ): Promise<IVotesInvalidationResponse> {
    const campaignId = invalidationRequest.campaignId;

    const campaign = await this.campaignsService.get(campaignId);

    if (!campaign || !!campaign.deleteDate) {
      throw new NotFoundException(`Campaign not found by id ${campaignId}`);
    }

    if (
      !this.campaignsService.hasVoteManagementAccess(request.user, campaign)
    ) {
      throw new ForbiddenException(
        `User does not have access to vote management for campaign ${campaign.id}`,
      );
    }

    const count = await this.votesService.invalidate(
      campaignId,
      invalidationRequest.voteIds,
    );

    const response: IVotesInvalidationResponse = {
      count: count,
    };

    return response;
  }
}
