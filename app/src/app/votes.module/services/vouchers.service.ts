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
  IVoteVoucherSearchRequest,
  IVoteVoucherSearchResponse,
  IVotingVoucherCreateRequest,
  IVotingVoucherCreateResponse,
  UserVouchersResponse,
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

  public async create(voucher: VotingVoucher): Promise<string> {
    const request: IVotingVoucherCreateRequest = {
      campaignId: voucher.campaignId,
      dto: VotingVoucherDto.map(voucher),
    };

    const response = await this.vouchersApi.create(request);

    return response.id;
  }

  public async createMany(
    campaign: Campaign,
    usernames: string[]
  ): Promise<number> {
    const request: IBulkVotingVoucherCreateRequest = {
      campaignId: campaign.id,
      usernames: usernames,
    };

    const response = await this.vouchersApi.createMany(request);

    return response.count;
  }

  public async search(campaignId): Promise<VotingVoucher[]> {
    const request: IVoteVoucherSearchRequest = {
      campaignId: campaignId,
    };

    const response = await this.vouchersApi.search(request);

    const vouchers = VotingVoucher.mapList(response.rows);

    return vouchers;
  }

  public async delete(id): Promise<void> {
    return this.vouchersApi.delete(id);
  }

  public async getPending(): Promise<UserVouchersResponse> {
    return this.vouchersApi.getPending();
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
      search: async (searchRequest) => {
        const url = apiUrl + 'search';

        const request = this.httpClient.post<IVoteVoucherSearchResponse>(
          url,
          searchRequest,
          {
            observe: 'body',
          }
        );

        return firstValueFrom(request);
      },
      delete: async (id) => {
        const url = apiUrl + id;

        const request = this.httpClient.delete<void>(url, {
          observe: 'body',
        });

        return firstValueFrom(request);
      },
      getPending: async () => {
        const url = apiUrl + 'pending';

        const request = this.httpClient.get<UserVouchersResponse>(url, {
          observe: 'body',
        });

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
  search(
    request: IVoteVoucherSearchRequest
  ): Promise<IVoteVoucherSearchResponse>;
  delete(id: string): Promise<void>;
  getPending(): Promise<UserVouchersResponse>;
}
