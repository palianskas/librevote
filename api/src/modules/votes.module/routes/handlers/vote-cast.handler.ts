import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CampaignsService } from 'src/modules/campaigns.module/campaigns.service';
import { VotingMechanism } from 'src/modules/campaigns.module/models/campaign-settings/campaign-settings.model';
import { Campaign } from 'src/modules/campaigns.module/models/campaign/campaign.model';
import { IVoteCastRequest } from '../models/votes-contracts.model';
import { VotesService } from '../../votes.service';
import { VouchersService } from '../../vouchers.service';
import { VotingVoucher } from '../../models/voting-voucher.model';

@Injectable()
export class VoteCastHandler {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly votesService: VotesService,
    private readonly vouchersService: VouchersService,
  ) {}

  async handle(
    request: IVoteCastRequest,
    user: User | undefined,
  ): Promise<string> {
    const campaign = await this.campaignsService.get(request.dto.campaignId);

    await this.validateRequest(request, campaign, user);

    const result = await this.votesService.create(request.dto);

    return result.id;
  }

  private async validateRequest(
    request: IVoteCastRequest,
    campaign: Campaign | null,
    user: User | undefined,
  ): Promise<void> {
    if (!campaign || !!campaign.deleteDate) {
      throw new NotFoundException(
        `Campaign not found by id: ${request.dto.campaignId}`,
      );
    }

    if (!this.campaignsService.isVotingActive(campaign)) {
      throw new BadRequestException(
        `Voting is not active for campaign ${campaign.id}`,
      );
    }

    const campaignVoteCount = await this.votesService.getVoteCountForCampaign(
      campaign.id,
    );

    if (!campaign.settings) {
      throw new Error(`Cannot determine settings for campaign ${campaign.id}`);
    }

    if (campaignVoteCount >= campaign.settings.maxVoterCount) {
      throw new BadRequestException(
        `Max vote count reached for campaign ${campaign.id}`,
      );
    }

    const votingMechanism = campaign.settings.votingMechanism;

    switch (VotingMechanism[votingMechanism]) {
      case VotingMechanism.InviteOnly: {
        await this.validateInviteOnlyVoting(campaign, user);
        break;
      }
      case VotingMechanism.Voucher: {
        await this.validateVoucherVoting(request);
        break;
      }
      case VotingMechanism.Public:
        break;
      default: {
        throw new Error(
          `Cannot determine voting mechanism for campaign ${campaign.id}`,
        );
      }
    }
  }

  private async validateInviteOnlyVoting(
    campaign: Campaign,
    user: User | undefined,
  ): Promise<void> {
    if (!user) {
      throw new BadRequestException(
        `Campaign ${campaign.id} voting is invite-only`,
      );
    }

    const vouchers = await this.vouchersService.searchByCampaignVoter(
      user.id,
      campaign.id,
    );

    if (!vouchers.some(this.isVoucherValid)) {
      throw new ForbiddenException(
        `User ${user.id} does not have permission to vote in campaign ${campaign.id}`,
      );
    }
  }

  private async validateVoucherVoting(
    request: IVoteCastRequest,
  ): Promise<void> {
    if (!request.dto.voucherId) {
      throw new NotFoundException(
        `Voting voucher is required for campaign ${request.dto.campaignId}`,
      );
    }

    const voucher = await this.vouchersService.get(request.dto.voucherId);

    if (!voucher) {
      throw new NotFoundException(
        `Voting voucher not found by id ${request.dto.voucherId}`,
      );
    }

    if (!this.isVoucherValid(voucher)) {
      throw new ForbiddenException(`Voting voucher ${voucher.id} is invalid`);
    }
  }

  private isVoucherValid(voucher: VotingVoucher): boolean {
    const now = new Date();

    if (voucher.isSpent) {
      return false;
    }

    if (voucher.issueDate > now) {
      return false;
    }

    if (!!voucher.validUntilDate && voucher.validUntilDate < now) {
      return false;
    }

    return true;
  }
}
