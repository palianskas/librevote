import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { Public } from 'src/modules/auth.module/guards/guard-activators.decorator';
import { CampaignCandidateDto } from '../models/campaign-candidate/campaign-candidate.dto';
import { CampaignResultsService } from '../campaign-results/campaign-results.service';
import {
  ICampaignResultsSaveRequest as ICampaignResultsCreateRequest,
  ICampaignResultsSaveResponse as ICampaignResultsCreateResponse,
} from './models/campaign-results-contracts.model';
import { CampaignResultsDto } from '../models/campaign-results/campaign-results.dto';

@Public()
@Controller('campaign-results')
export class CampaignResultsController {
  constructor(
    private readonly campaignResultsService: CampaignResultsService,
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
  async create(
    @Body() request: ICampaignResultsCreateRequest,
  ): Promise<ICampaignResultsCreateResponse> {
    const dto = request.dto;

    const id = await this.campaignResultsService.create(dto);

    const response: ICampaignResultsCreateResponse = {
      id: id,
    };

    return response;
  }
}
