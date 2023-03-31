import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Campaign } from 'src/app/campaigns.module/models/campaign.model';
import { ConfigService } from 'src/app/common.module/services/config.service';
import {
  VotingVoucher,
  VotingVoucherDto,
} from '../models/voting-voucher.model';
import {
  IBulkVotingVoucherCreateRequest,
  IBulkVotingVoucherCreateResponse,
  IVotingVoucherCreateRequest,
  IVotingVoucherCreateResponse,
} from '../models/vouchers-contracts.model';

@Injectable({
  providedIn: 'root',
})
export class VotingVouchersService {
  private vouchersApi: IVotingVouchersApi;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService
  ) {
    this.initApi();
  }

  public async get(id: string): Promise<VotingVoucher> {
    const dto = await this.vouchersApi.get(id);

    const voucher = VotingVoucher.map(dto);

    return voucher;
  }

  public async create(vote: VotingVoucher): Promise<string> {
    const request: IVotingVoucherCreateRequest = {
      campaignId: vote.campaignId,
      dto: VotingVoucherDto.map(vote),
    };

    const response = await this.vouchersApi.create(request);

    return response.id;
  }

  public async createMany(
    campaign: Campaign,
    usernames: string[]
  ): Promise<void> {
    const request: IBulkVotingVoucherCreateRequest = {
      campaignId: campaign.id,
      usernames: usernames,
    };

    await this.vouchersApi.createMany(request);
  }

  private initApi(): void {
    const apiUrl = this.configService.API_URL + 'vouchers/';

    this.vouchersApi = {
      get: async (id) => {
        const url = apiUrl + id;

        const request = this.httpClient.get<VotingVoucherDto>(url, {
          observe: 'body',
        });

        return firstValueFrom(request).catch(() => {
          return null;
        });
      },
      create: async (createRequest) => {
        const request = this.httpClient.post<IVotingVoucherCreateResponse>(
          apiUrl,
          createRequest,
          {
            observe: 'body',
          }
        );

        return firstValueFrom(request);
      },
      createMany: async (createRequest) => {
        const url = apiUrl + 'bulk';

        const request = this.httpClient.post<IBulkVotingVoucherCreateResponse>(
          url,
          createRequest,
          {
            observe: 'body',
          }
        );

        return firstValueFrom(request);
      },
    };
  }
}

interface IVotingVouchersApi {
  get(id: string): Promise<VotingVoucherDto | null>;
  create(
    request: IVotingVoucherCreateRequest
  ): Promise<IVotingVoucherCreateResponse>;
  createMany(
    request: IBulkVotingVoucherCreateRequest
  ): Promise<IBulkVotingVoucherCreateResponse>;
}
