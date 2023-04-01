import { Injectable } from '@nestjs/common';
import { VotingVoucher, VotingVoucherDto } from './models/voting-voucher.model';
import { VouchersRepository } from './vouchers.repository';

@Injectable()
export class VouchersService {
  constructor(private readonly vouchersRepository: VouchersRepository) {}

  async get(id: string): Promise<VotingVoucher | null> {
    const voucher = this.vouchersRepository.get(id);

    return voucher;
  }

  async update(dto: VotingVoucherDto): Promise<VotingVoucher> {
    const voucher = this.vouchersRepository.update(dto);

    return voucher;
  }

  async create(dto: VotingVoucherDto): Promise<VotingVoucher> {
    return this.vouchersRepository.create(dto);
  }

  async createMany(dtos: VotingVoucherDto[]): Promise<number> {
    return this.vouchersRepository.createMany(dtos);
  }

  async search(filter: any): Promise<VotingVoucher[]> {
    return this.vouchersRepository.search(filter);
  }

  async searchByCampaignVoter(
    designatedUserId: string,
    campaignId: string,
  ): Promise<VotingVoucher[]> {
    const filter = {
      campaignId: campaignId,
      designatedUserId: designatedUserId,
    };

    return this.vouchersRepository.search(filter);
  }
}
