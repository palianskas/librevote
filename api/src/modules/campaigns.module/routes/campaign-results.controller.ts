import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { Public } from 'src/modules/auth.module/guards/guard-activators.decorator';
import { CampaignResultsService } from '../campaign-results/campaign-results.service';
import {
  ICampaignResultsSaveRequest,
  ICampaignResultsSaveResponse,
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
  async save(
    @Body() request: ICampaignResultsSaveRequest,
  ): Promise<ICampaignResultsSaveResponse> {
    const dto = request.dto;

    const id = await this.campaignResultsService.save(dto);

    const response: ICampaignResultsSaveResponse = {
      id: id,
    };

    return response;
  }
}
