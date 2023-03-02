import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, firstValueFrom } from 'rxjs';
import {
  ILoginResponse,
  ITokenRefreshResponse,
  ILoginRequest,
  ITokenRefreshRequest,
} from 'src/app/auth.module/models/auth-contracts.model';
import { User, UserDto } from 'src/app/auth.module/models/user.model';
import { ConfigService } from 'src/app/common.module/services/config.service';
import {
  ICampaignCreateRequest,
  ICampaignCreateResponse,
  ICampaignSearchRequest,
  ICampaignSearchResponse,
} from '../models/campaign-search-contracts.model';
import { Campaign, CampaignDto } from '../models/campaign.model';

@Injectable({
  providedIn: 'root',
})
export class CampaignsService {
  private campaignsApi: ICampaignsApi;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService
  ) {
    this.campaignsApi = this.initApi();

    this.init();
  }

  async init(): Promise<void> {}

  async get(id: string): Promise<Campaign> {
    const dto = await this.campaignsApi.get(id);

    const campaign = Campaign.map(dto);

    return campaign;
  }

  async create(dto: CampaignDto): Promise<string> {
    const request: ICampaignCreateRequest = {
      dto: dto,
    };

    const response = await this.campaignsApi.create(request);

    return response.id;
  }

  async search(request: ICampaignSearchRequest): Promise<Campaign[]> {
    const response = await this.campaignsApi.search(request);

    const campaigns = response.rows.map((row) => Campaign.map(row));

    return campaigns;
  }

  private initApi(): ICampaignsApi {
    const apiUrl = this.configService.API_URL + 'campaigns/';

    const api: ICampaignsApi = {
      get: async (id) => {
        const url = apiUrl + id;

        const request = this.httpClient.get<CampaignDto>(url, {
          observe: 'body',
        });

        return firstValueFrom(request);
      },
      create: async (createRequest) => {
        const request = this.httpClient.post<ICampaignCreateResponse>(
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

        const request = this.httpClient.post<ICampaignSearchResponse>(
          url,
          searchRequest,
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

interface ICampaignsApi {
  get(id: string): Promise<CampaignDto>;
  create(dto: ICampaignCreateRequest): Promise<ICampaignCreateResponse>;
  search(request: ICampaignSearchRequest): Promise<ICampaignSearchResponse>;
}
