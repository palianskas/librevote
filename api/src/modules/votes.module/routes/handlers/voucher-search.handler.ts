import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CampaignsService } from 'src/modules/campaigns.module/campaigns.service';
import { Campaign } from 'src/modules/campaigns.module/models/campaign/campaign.model';
import { VotingVoucherDto } from '../../models/voting-voucher.model';
import { VouchersService } from '../../vouchers.service';
import {
  IVoteVoucherSearchRequest,
  IVoteVoucherSearchResponse,
} from '../models/vote-vouchers-contracts.model';

@Injectable()
export class VoucherSearchHandler {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly vouchersService: VouchersService,
  ) {}

  async handle(
    request: IVoteVoucherSearchRequest,
    user: User,
  ): Promise<IVoteVoucherSearchResponse> {
    const campaign = await this.campaignsService.get(request.campaignId);

    if (!campaign || !!campaign.deleteDate) {
      throw new NotFoundException(
        `Campaign not found by id: ${request.campaignId}`,
      );
    }

    this.validateAccess(campaign, user);

    const filter = {
      campaignId: request.campaignId,
      deleteDate: null,
    };

    const vouchers = await this.vouchersService.search(filter);

    const response: IVoteVoucherSearchResponse = {
      rows: VotingVoucherDto.mapList(vouchers),
    };

    return response;
  }

  private validateAccess(campaign: Campaign, user: User): void {
    if (!this.campaignsService.hasReadAccess(user, campaign)) {
      throw new ForbiddenException(
        `User does not have access to create voting vouchers for campaign ${campaign.id}`,
      );
    }
  }
}
