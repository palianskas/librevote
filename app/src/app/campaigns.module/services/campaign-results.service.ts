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
import { EncryptionDomainFactory } from 'src/app/encryption.module/encryption-domain/encryption-domain.factory';

@Injectable({
  providedIn: 'root',
})
export class CampaignResultsService {
  private campaignResultsApi: ICampaignResultsApi;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
    private readonly encryptionDomainFactory: EncryptionDomainFactory
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

  async save(dto: CampaignResultsDto, force = false): Promise<string> {
    const request: ICampaignResultsSaveRequest = {
      dto: dto,
      force: force,
    };

    const response = await this.campaignResultsApi.save(request);

    return response.id;
  }

  encryptResults(results: CampaignResults, password: string): CampaignResults {
    const encryptionDomain =
      this.encryptionDomainFactory.getAesEncryptionDomain(password);

    const encryptedResults = CampaignResults.map(results);

    encryptedResults.totalVoteCount = encryptionDomain.encrypt(
      results.totalVoteCount
    );

    if (!(encryptedResults.candidateResults?.length > 0)) {
      return encryptedResults;
    }
    for (let i = 0; i < encryptedResults.candidateResults.length; i++) {
      encryptedResults.candidateResults[i].voteCount = encryptionDomain.encrypt(
        results.candidateResults[i].voteCount
      );
    }

    return encryptedResults;
  }

  decryptResults(
    encryptedResults: CampaignResults,
    password: string
  ): CampaignResults {
    const encryptionDomain =
      this.encryptionDomainFactory.getAesEncryptionDomain(password);

    const decryptedResults = CampaignResults.map(encryptedResults);

    decryptedResults.totalVoteCount = encryptionDomain.decrypt(
      encryptedResults.totalVoteCount
    );

    if (!(decryptedResults.candidateResults?.length > 0)) {
      return decryptedResults;
    }
    for (let i = 0; i < decryptedResults.candidateResults.length; i++) {
      decryptedResults.candidateResults[i].voteCount = encryptionDomain.decrypt(
        encryptedResults.candidateResults[i].voteCount
      );
    }

    return decryptedResults;
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
