import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from 'src/app/common.module/services/config.service';
import { Vote, VoteDto } from '../models/vote.model';
import {
  IVoteCreateRequest,
  IVoteCreateResponse,
  IVoteSearchRequest,
  IVoteSearchResponse,
} from '../models/votes-contracts.model';

@Injectable({
  providedIn: 'root',
})
export class VotesService {
  private votesApi: IVotesApi;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService
  ) {
    this.initApi();
  }

  public async get(id: string): Promise<Vote> {
    const dto = await this.votesApi.get(id);

    const vote = Vote.map(dto);

    return vote;
  }

  public async create(vote: Vote): Promise<string> {
    const request: IVoteCreateRequest = {
      dto: VoteDto.map(vote),
    };

    const response = await this.votesApi.create(request);

    return response.id;
  }

  public async getCampaignVotes(campaignId: string): Promise<Vote[]> {
    const request: IVoteSearchRequest = {
      campaignId: campaignId,
    };

    const response = await this.votesApi.search(request);

    const votes = Vote.mapList(response.rows);

    return votes;
  }

  private initApi(): void {
    const apiUrl = this.configService.API_URL + 'votes/';

    this.votesApi = {
      get: async (id) => {
        const url = apiUrl + id;

        const request = this.httpClient.get<VoteDto>(url, {
          observe: 'body',
        });

        return firstValueFrom(request).catch(() => {
          return null;
        });
      },
      create: async (createRequest) => {
        const request = this.httpClient.post<IVoteCreateResponse>(
          apiUrl,
          createRequest,
          {
            observe: 'body',
          }
        );

        return firstValueFrom(request);
      },
      search: async (searchRequest) => {
        const url = apiUrl + 'search/';

        const request = this.httpClient.post<IVoteSearchResponse>(
          url,
          searchRequest,
          {
            observe: 'body',
          }
        );

        return firstValueFrom(request);
      },
    };
  }
}

interface IVotesApi {
  get(id: string): Promise<VoteDto | null>;
  create(request: IVoteCreateRequest): Promise<IVoteCreateResponse>;
  search(request: IVoteSearchRequest): Promise<IVoteSearchResponse>;
}
