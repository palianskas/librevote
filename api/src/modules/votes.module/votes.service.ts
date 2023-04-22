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

  create(dto: VoteDto, voterIpHash: string): Promise<Vote> {
    return this.votesRepository.create(dto, voterIpHash);
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
      isInvalid: false,
    };

    const cursor = this.buildSearchCuror(page);

    return this.search(filter, cursor);
  }

  getVoteCountForCampaign(campaignId: string): Promise<number> {
    const filter = {
      campaignId: campaignId,
      isInvalid: false,
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
      this.campaignService.isVotingActive(campaign) &&
      !!campaign.settings &&
      campaign.settings.maxVoterCount > currentCampaignVoteCount;

    const response: IPublicVotingStatusResponse = {
      campaignId: campaign.id,
      isAcceptingVotes: isAcceptingVotes,
    };

    return response;
  }

  async invalidate(campaignId: string, voteIds: string[]): Promise<number> {
    const filter = {
      campaignId: campaignId,
      id: {
        in: voteIds,
      },
    };

    const data: Partial<Vote> = {
      isInvalid: true,
    };

    return this.votesRepository.bulkUpdate(filter, data);
  }

  async hasIpVotedInCampaign(
    campaignId: string,
    ipHash: string,
  ): Promise<boolean> {
    const filter = {
      campaignId: campaignId,
      voterIpHash: ipHash,
    };

    const ipVoteCount = await this.count(filter);

    return ipVoteCount > 0;
  }

  private buildSearchCuror(page: number): IPrismaCursor {
    const cursor: IPrismaCursor = {
      skip: page * DataAccessService.DEFAULT_PAGE_SIZE,
      take: DataAccessService.DEFAULT_PAGE_SIZE,
    };

    return cursor;
  }
}
