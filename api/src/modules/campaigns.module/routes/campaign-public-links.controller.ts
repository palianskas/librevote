import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { Public } from 'src/modules/auth.module/guards/guard-activators.decorator';
import { IAuthenticatedRequest } from 'src/modules/auth.module/routes/models/auth-contracts.model';
import { CampaignPublicLinksService } from '../campaign-public-links.service';
import { CampaignPublicLinkDto } from '../models/campaign-public-link.dto';
import {
  ICampaignPublicLinkCreateRequest,
  ICampaignPublicLinkCreateResponse,
} from './models/campaign-public-links-contracts.model';

@Public()
@Controller('campaign-public-links')
export class CampaignPublicLinksController {
  constructor(
    private readonly campaignPublicLinksService: CampaignPublicLinksService,
  ) {}

  @Get(':id')
  async get(@Param('id') id: string): Promise<CampaignPublicLinkDto> {
    const campaignPublicLink = await this.campaignPublicLinksService.get(id);

    if (!campaignPublicLink) {
      throw new NotFoundException();
    }

    const dto = CampaignPublicLinkDto.map(campaignPublicLink);

    return dto;
  }

  @Post()
  async create(
    @Body() body: ICampaignPublicLinkCreateRequest,
    @Request() request: IAuthenticatedRequest,
  ): Promise<ICampaignPublicLinkCreateResponse> {
    const user = request.user;
    const dto = body.dto;

    const id = await this.campaignPublicLinksService.create(dto);

    const response: ICampaignPublicLinkCreateResponse = {
      id: id,
    };

    return response;
  }
}
