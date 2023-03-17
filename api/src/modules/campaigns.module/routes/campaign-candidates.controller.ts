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
import { CampaignCandidatesService } from '../campaign-candidates/campaign-candidates.service';
import { CampaignCandidateDto } from '../models/campaign-candidate/campaign-candidate.dto';
import {
  ICampaignCandidateCreateRequest,
  ICampaignCandidateCreateResponse,
} from './models/campaign-candidates-contracts.model';

@Public()
@Controller('campaign-public-links')
export class CampaignCandidatesController {
  constructor(
    private readonly campaignCandidatesService: CampaignCandidatesService,
  ) {}

  @Get(':id')
  async get(@Param('id') id: string): Promise<CampaignCandidateDto> {
    const campaignCandidate = await this.campaignCandidatesService.get(id);

    if (!campaignCandidate) {
      throw new NotFoundException();
    }

    const dto = CampaignCandidateDto.map(campaignCandidate);

    return dto;
  }

  @Post()
  async create(
    @Body() request: ICampaignCandidateCreateRequest,
  ): Promise<ICampaignCandidateCreateResponse> {
    const dto = request.dto;

    const id = await this.campaignCandidatesService.create(dto);

    const response: ICampaignCandidateCreateResponse = {
      id: id,
    };

    return response;
  }

  // @Put()
  // async update(
  //   @Body() request: ICampaignCandidateUpdateRequest,
  // ): Promise<ICampaignCandidateUpdateResponse> {
  //   const requestDto = request.dto;

  //   if (!requestDto.id) {
  //     throw new BadRequestException('ID not specified!');
  //   }

  //   const existingLink = await this.campaignCandidatesService.get(
  //     requestDto.id,
  //   );

  //   if (!existingLink) {
  //     throw new BadRequestException(
  //       `Public link not found by ID: ${requestDto.id}`,
  //     );
  //   }

  //   const link = await this.campaignCandidatesService.update(requestDto);

  //   const response: ICampaignCandidateUpdateResponse = {
  //     dto: CampaignCandidateDto.map(link),
  //   };

  //   return response;
  // }
}
