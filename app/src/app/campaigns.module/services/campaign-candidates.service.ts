import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from 'src/app/common.module/services/config.service';
import {
  CampaignCandidate,
  CampaignCandidateDto,
} from '../models/campaign-candidates/campaign-candidate.model';
import {
  ICampaignCandidateCreateRequest,
  ICampaignCandidateCreateResponse,
} from '../models/campaign-candidates/campaign-candidates-contracts.model';

@Injectable({
  providedIn: 'root',
})
export class CampaignCandidatesService {
  private campaignCandidatesApi: ICampaignCandidatesApi;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService
  ) {
    this.campaignCandidatesApi = this.initApi();
  }

  async get(id: string): Promise<CampaignCandidate | null> {
    const dto = await this.campaignCandidatesApi.get(id);

    if (!dto) {
      return null;
    }

    const campaignCandidate = CampaignCandidate.map(dto);

    return campaignCandidate;
  }

  async create(dto: CampaignCandidateDto): Promise<string> {
    const request: ICampaignCandidateCreateRequest = {
      dto: dto,
    };

    const response = await this.campaignCandidatesApi.create(request);

    return response.id;
  }

  private initApi(): ICampaignCandidatesApi {
    const apiUrl = this.configService.API_URL + 'campaign-candidates/';

    const api: ICampaignCandidatesApi = {
      get: async (id: string): Promise<CampaignCandidateDto> => {
        const url = apiUrl + id;

        const request = this.httpClient.get<CampaignCandidateDto>(url, {
          observe: 'body',
        });

        return firstValueFrom(request).catch(() => {
          return null;
        });
      },
      create: async (createRequest: ICampaignCandidateCreateRequest) => {
        const request = this.httpClient.post<ICampaignCandidateCreateResponse>(
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

interface ICampaignCandidatesApi {
  get(id: string): Promise<CampaignCandidateDto | null>;
  create(
    request: ICampaignCandidateCreateRequest
  ): Promise<ICampaignCandidateCreateResponse>;
}
