import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth.module/services/auth.service';
import { ConfigService } from 'src/app/common.module/services/config.service';
import {
  CampaignPublicLink,
  CampaignPublicLinkDto,
} from '../models/campaign-public-links/campaign-public-link.model';
import {
  ICampaignPublicLinkCreateRequest,
  ICampaignPublicLinkCreateResponse,
  ICampaignPublicLinkUpdateRequest,
  ICampaignPublicLinkUpdateResponse,
} from '../models/campaign-public-links/campaign-public-links-contracts.model';

@Injectable({
  providedIn: 'root',
})
export class CampaignPublicLinksService {
  private campaignPublicLinksApi: ICampaignPublicLinksApi;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService
  ) {
    this.campaignPublicLinksApi = this.initApi();
  }

  async get(id: string): Promise<CampaignPublicLink | null> {
    const dto = await this.campaignPublicLinksApi.get(id);

    if (!dto) {
      return null;
    }

    const campaignPublicLink = CampaignPublicLink.map(dto);

    return campaignPublicLink;
  }

  async getByLink(link: string): Promise<CampaignPublicLink | null> {
    const dto = await this.campaignPublicLinksApi.getByLink(link);

    if (!dto) {
      return null;
    }

    const campaignPublicLink = CampaignPublicLink.map(dto);

    return campaignPublicLink;
  }

  async create(dto: CampaignPublicLinkDto): Promise<string> {
    const request: ICampaignPublicLinkCreateRequest = {
      dto: dto,
    };

    const response = await this.campaignPublicLinksApi.create(request);

    return response.id;
  }

  async update(dto: CampaignPublicLinkDto): Promise<CampaignPublicLinkDto> {
    const request: ICampaignPublicLinkCreateRequest = {
      dto: dto,
    };

    const response = await this.campaignPublicLinksApi.update(request);

    return response.dto;
  }

  private initApi(): ICampaignPublicLinksApi {
    const apiUrl = this.configService.API_URL + 'campaign-public-links/';

    const api: ICampaignPublicLinksApi = {
      get: async (id: string): Promise<CampaignPublicLinkDto> => {
        const url = apiUrl + id;

        const request = this.httpClient.get<CampaignPublicLinkDto>(url, {
          observe: 'body',
        });

        return firstValueFrom(request).catch(() => {
          return null;
        });
      },
      getByLink: async (link: string): Promise<CampaignPublicLinkDto> => {
        const url = apiUrl + 'link/' + link;

        const request = this.httpClient.get<CampaignPublicLinkDto>(url, {
          observe: 'body',
        });

        return firstValueFrom(request).catch(() => {
          return null;
        });
      },
      create: async (createRequest: ICampaignPublicLinkCreateRequest) => {
        const request = this.httpClient.post<ICampaignPublicLinkCreateResponse>(
          apiUrl,
          createRequest,
          {
            observe: 'body',
          }
        );

        return firstValueFrom(request);
      },
      update: async (updateRequest: ICampaignPublicLinkUpdateRequest) => {
        const request = this.httpClient.put<ICampaignPublicLinkUpdateResponse>(
          apiUrl,
          updateRequest,
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

interface ICampaignPublicLinksApi {
  get(id: string): Promise<CampaignPublicLinkDto | null>;
  getByLink(link: string): Promise<CampaignPublicLinkDto | null>;
  create(
    request: ICampaignPublicLinkCreateRequest
  ): Promise<ICampaignPublicLinkCreateResponse>;
  update(
    request: ICampaignPublicLinkUpdateRequest
  ): Promise<ICampaignPublicLinkUpdateResponse>;
}
