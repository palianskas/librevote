import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Public } from 'src/modules/auth.module/guards/guard-activators.decorator';
import { CampaignPublicLinksService } from '../campaign-public-links/campaign-public-links.service';
import { CampaignPublicLinkDto } from '../models/campaign-public-link/campaign-public-link.dto';
import {
  ICampaignPublicLinkCreateRequest,
  ICampaignPublicLinkCreateResponse,
  ICampaignPublicLinkUpdateRequest,
  ICampaignPublicLinkUpdateResponse,
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

  @Get('link/:link')
  async getByLink(@Param('link') link: string): Promise<CampaignPublicLinkDto> {
    const campaignPublicLink = await this.campaignPublicLinksService.getByLink(
      link,
    );

    if (!campaignPublicLink || !!campaignPublicLink.campaign?.deleteDate) {
      throw new NotFoundException();
    }

    const dto = CampaignPublicLinkDto.map(campaignPublicLink);

    return dto;
  }

  @Post()
  async create(
    @Body() request: ICampaignPublicLinkCreateRequest,
  ): Promise<ICampaignPublicLinkCreateResponse> {
    const dto = request.dto;

    const entity = await this.campaignPublicLinksService.getByLink(dto.link);

    if (entity?.campaign?.deleteDate !== null) {
      throw new BadRequestException(
        `Cannot create duplicate link: ${dto.link}`,
      );
    }

    const id = await this.campaignPublicLinksService.create(dto);

    const response: ICampaignPublicLinkCreateResponse = {
      id: id,
    };

    return response;
  }

  @Put()
  async update(
    @Body() request: ICampaignPublicLinkUpdateRequest,
  ): Promise<ICampaignPublicLinkUpdateResponse> {
    const requestDto = request.dto;

    if (!requestDto.id) {
      throw new BadRequestException('ID not specified!');
    }

    const existingLink = await this.campaignPublicLinksService.get(
      requestDto.id,
    );

    if (!existingLink) {
      throw new BadRequestException(
        `Public link not found by ID: ${requestDto.id}`,
      );
    }

    const link = await this.campaignPublicLinksService.update(requestDto);

    const response: ICampaignPublicLinkUpdateResponse = {
      dto: CampaignPublicLinkDto.map(link),
    };

    return response;
  }
}
