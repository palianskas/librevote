import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from 'src/app/common.module/services/config.service';
import {
  CampaignResults,
  CampaignResultsDto,
} from '../models/campaign-results/campaign-results.model';
import {
  ICampaignResultsSaveRequest,
  ICampaignResultsSaveResponse,
} from '../models/campaign-results/campaign-results-contracts.model';

@Injectable({
  providedIn: 'root',
})
export class CampaignResultsService {
  private campaignResultsApi: ICampaignResultsApi;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService
  ) {
    this.campaignResultsApi = this.initApi();
  }

  async get(id: string): Promise<CampaignResults | null> {
    const dto = await this.campaignResultsApi.get(id);

    if (!dto) {
      return null;
    }

    const campaignPublicLink = CampaignResults.map(dto);

    return campaignPublicLink;
  }

  async save(dto: CampaignResultsDto): Promise<string> {
    const request: ICampaignResultsSaveRequest = {
      dto: dto,
    };

    const response = await this.campaignResultsApi.save(request);

    return response.id;
  }

  private initApi(): ICampaignResultsApi {
    const apiUrl = this.configService.API_URL + 'campaign-results/';

    const api: ICampaignResultsApi = {
      get: async (id: string): Promise<CampaignResultsDto> => {
        const url = apiUrl + id;

        const request = this.httpClient.get<CampaignResultsDto>(url, {
          observe: 'body',
        });

        return firstValueFrom(request).catch(() => {
          return null;
        });
      },
      save: async (createRequest: ICampaignResultsSaveRequest) => {
        const request = this.httpClient.post<ICampaignResultsSaveResponse>(
          apiUrl,
          createRequest,
          {
            observe: 'body',
          }
        );

        return firstValueFrom(request);
      },
    };

    return api;
  }
}

interface ICampaignResultsApi {
  get(id: string): Promise<CampaignResultsDto | null>;
  save(
    request: ICampaignResultsSaveRequest
  ): Promise<ICampaignResultsSaveResponse>;
}
