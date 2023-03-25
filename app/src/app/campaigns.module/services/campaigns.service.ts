import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth.module/services/auth.service';
import { ConfigService } from 'src/app/common.module/services/config.service';
import {
  ICampaignCreateRequest,
  ICampaignCreateResponse,
  ICampaignPubKeySaveRequest,
  ICampaignPubKeySaveResponse,
  ICampaignSearchRequest,
  ICampaignSearchResponse,
  ICampaignUpdateRequest,
  ICampaignUpdateResponse,
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

  async create(campaign: Campaign): Promise<string> {
    const dto = CampaignDto.map(campaign);

    const request: ICampaignCreateRequest = {
      dto: dto,
    };

    const response = await this.campaignsApi.create(request);

    return response.id;
  }

  async update(campaign: Campaign): Promise<CampaignDto> {
    const dto = CampaignDto.map(campaign);

    const request: ICampaignUpdateRequest = {
      dto: dto,
    };

    const response = await this.campaignsApi.update(request);

    return response.dto;
  }

  async search(request: ICampaignSearchRequest): Promise<Campaign[]> {
    const response = await this.campaignsApi.search(request);

    const campaigns = response.rows.map((row) => Campaign.map(row));

    return campaigns;
  }

  async savePubKey(campaign: Campaign): Promise<string | null> {
    if (!campaign.pubKey) {
      return null;
    }

    const request: ICampaignPubKeySaveRequest = {
      pubKey: campaign.pubKey,
    };

    const response = await this.campaignsApi.savePubKey(campaign.id, request);

    return response.pubKey;
  }

  async fetchUserCampaigns(): Promise<Campaign[]> {
    const user = await this.authService.getUser();

    const request: ICampaignSearchRequest = {
      userIds: [user.id],
    };

    const campaigns = await this.search(request);

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
      update: async (saveRequest) => {
        const request = this.httpClient.put<ICampaignUpdateResponse>(
          apiUrl,
          saveRequest,
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
      savePubKey: async (campaignId, saveRequest) => {
        const url = apiUrl + campaignId + '/pubkey';

        const request = this.httpClient.post<ICampaignPubKeySaveResponse>(
          url,
          saveRequest,
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
  create(request: ICampaignCreateRequest): Promise<ICampaignCreateResponse>;
  update(request: ICampaignUpdateRequest): Promise<ICampaignUpdateResponse>;
  search(request: ICampaignSearchRequest): Promise<ICampaignSearchResponse>;
  savePubKey(
    campaignId: string,
    request: ICampaignPubKeySaveRequest
  ): Promise<ICampaignPubKeySaveResponse>;
}
