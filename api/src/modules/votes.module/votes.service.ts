import { Injectable } from '@nestjs/common';
import { Vote, VoteDto } from './models/vote.model';
import { VotesRepository } from './votes.repository';
import { IPrismaCursor } from '../data.module/models/prisma-query.model';
import { DataAccessService } from '../data.module/data.service';
import { ISearchQueryResponse } from '../data.module/models/search-query-response.model';
import { IPublicVotingStatusResponse } from './routes/models/votes-contracts.model';
import { CampaignsService } from '../campaigns.module/campaigns.service';

@Injectable()
export class VotesService {
  constructor(
    private readonly votesRepository: VotesRepository,
    private readonly campaignService: CampaignsService,
  ) {}

  get(id: string): Promise<Vote | null> {
    const vote = this.votesRepository.get(id);

    return vote;
  }

  create(dto: VoteDto): Promise<Vote> {
    return this.votesRepository.create(dto);
  }

  search(
    filter: any,
    cursor: IPrismaCursor,
  ): Promise<ISearchQueryResponse<Vote>> {
    return this.votesRepository.search(filter, cursor);
  }

  count(filter: any): Promise<number> {
    return this.votesRepository.count(filter);
  }

  getVotesForCampaign(
    campaignId: string,
    page: number,
  ): Promise<ISearchQueryResponse<Vote>> {
    const filter = {
      campaignId: campaignId,
    };

    const cursor = this.buildSearchCuror(page);

    return this.search(filter, cursor);
  }

  getVoteCountForCampaign(campaignId: string): Promise<number> {
    const filter = {
      campaignId: campaignId,
    };

    return this.votesRepository.count(filter);
  }

  async status(id: string): Promise<IPublicVotingStatusResponse | null> {
    const campaign = await this.campaignService.get(id);

    if (!campaign || !!campaign.deleteDate) {
      return null;
    }

    const currentCampaignVoteCount = await this.getVoteCountForCampaign(
      campaign.id,
    );

    const isAcceptingVotes =
      !!campaign.settings &&
      campaign.settings.maxVoterCount > currentCampaignVoteCount;

    const response: IPublicVotingStatusResponse = {
      campaignId: campaign.id,
      isAcceptingVotes: isAcceptingVotes,
    };

    return response;
  }

  private buildSearchCuror(page: number): IPrismaCursor {
    const cursor: IPrismaCursor = {
      skip: page * DataAccessService.DEFAULT_PAGE_SIZE,
      take: DataAccessService.DEFAULT_PAGE_SIZE,
    };

    return cursor;
  }
}
