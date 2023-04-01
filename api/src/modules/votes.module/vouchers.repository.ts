import { Injectable } from '@nestjs/common';
import { DataAccessService } from '../data.module/data.service';
import { IPrismaQuery } from '../data.module/models/prisma-query.model';
import { VotingVoucher, VotingVoucherDto } from './models/voting-voucher.model';

@Injectable()
export class VouchersRepository {
  constructor(private readonly dataService: DataAccessService) {}

  async get(id: string): Promise<VotingVoucher | null> {
    const filter = {
      id: id,
    };

    const query = this.buildQuery(filter);

    const voucher = await this.dataService.votingVoucher.findFirst(query);

    return voucher as VotingVoucher;
  }

  async search(filter: any): Promise<VotingVoucher[]> {
    const query = this.buildQuery(filter);

    const votingVouchers = await this.dataService.votingVoucher.findMany(query);

    return votingVouchers as VotingVoucher[];
  }

  async create(dto: VotingVoucherDto): Promise<VotingVoucher> {
    const result = await this.dataService.votingVoucher.create({
      data: {
        campaignId: dto.campaignId,
        issueDate: dto.issueDate,
        validUntilDate: dto.validUntilDate,
        designatedUserId: dto.designatedUserId,
      },
      include: {
        campaign: true,
        designatedUser: true,
      },
    });

    return result;
  }

  async update(dto: VotingVoucherDto): Promise<VotingVoucher> {
    const data = {
      campaignId: dto.campaignId,
      issueDate: dto.issueDate,
      validUntilDate: dto.validUntilDate ?? null,
      designatedUserId: dto.designatedUserId ?? null,
      deleteDate: dto.deleteDate ?? null,
    };

    const result = await this.dataService.votingVoucher.update({
      where: { id: dto.id },
      data: data,
      include: {
        campaign: true,
        designatedUser: true,
      },
    });

    return result;
  }

  async createMany(dtos: VotingVoucherDto[]): Promise<number> {
    const data = dtos.map((dto) => ({
      campaignId: dto.campaignId,
      issueDate: dto.issueDate,
      validUntilDate: dto.validUntilDate,
      designatedUserId: dto.designatedUserId,
    }));

    const result = await this.dataService.votingVoucher.createMany({
      data: data,
    });

    return result.count;
  }

  private buildQuery(filter: any, fieldSelect: any = null): IPrismaQuery {
    const query: IPrismaQuery = {
      where: filter,
    };

    if (!!fieldSelect) {
      query.select = fieldSelect;
    } else {
      query.include = {
        campaign: true,
        designatedUser: true,
      };
    }

    return query;
  }
}
