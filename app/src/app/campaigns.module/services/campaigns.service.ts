import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth.module/services/auth.service';
import { ConfigService } from 'src/app/common.module/services/config.service';
import {
  ICampaignCreateRequest,
  ICampaignCreateResponse,
  ICampaignSearchRequest,
  ICampaignSearchResponse,
} from '../models/campaigns-contracts.model';
import { Campaign, CampaignDto } from '../models/campaign.model';

@Injectable({
  providedIn: 'root',
})
export class CampaignsService {
  private campaignsApi: ICampaignsApi;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    this.campaignsApi = this.initApi();
  }

  async get(id: string): Promise<Campaign | null> {
    const dto = await this.campaignsApi.get(id);

    if (!dto) {
      return null;
    }

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

  async fetchUserCampaigns(): Promise<Campaign[]> {
    const user = await this.authService.getUser();

    const request: ICampaignSearchRequest = {
      userIds: [user.id],
    };

    const response = await this.campaignsApi.search(request);

    const campaigns = response.rows.map((row) => Campaign.map(row));

    return campaigns;
  }

  private initApi(): ICampaignsApi {
    const apiUrl = this.configService.API_URL + 'campaigns/';

    const api: ICampaignsApi = {
      get: async (id): Promise<CampaignDto> => {
        const url = apiUrl + id;

        const request = this.httpClient.get<CampaignDto>(url, {
          observe: 'body',
        });

        return firstValueFrom(request).catch(() => {
          return null;
        });
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
  get(id: string): Promise<CampaignDto | null>;
  create(dto: ICampaignCreateRequest): Promise<ICampaignCreateResponse>;
  search(request: ICampaignSearchRequest): Promise<ICampaignSearchResponse>;
}
