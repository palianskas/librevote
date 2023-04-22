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
import {
  VotingVoucher,
  VotingVoucherDto,
} from '../../models/voting-voucher.model';
import { createHash } from 'crypto';

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
    voterIp: string,
  ): Promise<string> {
    const campaign = await this.campaignsService.get(request.dto.campaignId);

    const voterIpHash = createHash('sha256')
      .update(voterIp, 'ascii')
      .digest()
      .toString('ascii');

    const voucher = await this.validateRequest(
      request,
      campaign,
      user,
      voterIpHash,
    );

    if (!!voucher) {
      this.spendVoucher(voucher);
    }

    const result = await this.votesService.create(request.dto, voterIpHash);

    return result.id;
  }

  private async validateRequest(
    request: IVoteCastRequest,
    campaign: Campaign | null,
    user: User | undefined,
    voterIpHash: string,
  ): Promise<VotingVoucher | null> {
    if (!campaign || !!campaign.deleteDate) {
      throw new NotFoundException(
        `Campaign not found by id: ${request.dto.campaignId}`,
      );
    }

    if (!campaign.pubKey) {
      throw new NotFoundException(
        `Campaign ${request.dto.campaignId} does not have a public key`,
      );
    }

    if (!this.campaignsService.isVotingActive(campaign)) {
      throw new BadRequestException(
        `Voting is not active for campaign ${campaign.id}`,
      );
    }

    if (!campaign.settings) {
      throw new Error(`Cannot determine settings for campaign ${campaign.id}`);
    }

    const campaignVoteCount = await this.votesService.getVoteCountForCampaign(
      campaign.id,
    );

    if (campaignVoteCount >= campaign.settings.maxVoterCount) {
      throw new BadRequestException(
        `Max vote count reached for campaign ${campaign.id}`,
      );
    }

    const votingMechanism = campaign.settings.votingMechanism;

    switch (VotingMechanism[votingMechanism]) {
      case VotingMechanism.InviteOnly: {
        return await this.validateInviteOnlyVoting(campaign, user);
      }
      case VotingMechanism.Voucher: {
        return await this.validateVoucherVoting(request);
      }
      case VotingMechanism.Public: {
        await this.validatePublicVoting(request, voterIpHash);

        return null;
      }
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
  ): Promise<VotingVoucher> {
    if (!user) {
      throw new BadRequestException(
        `Campaign ${campaign.id} voting is invite-only`,
      );
    }

    const vouchers = await this.vouchersService.searchByCampaignVoter(
      user.id,
      campaign.id,
    );

    const voucher = vouchers.find(this.isVoucherValid);

    if (!voucher) {
      throw new ForbiddenException(
        `User ${user.id} does not have permission to vote in campaign ${campaign.id}`,
      );
    }

    return voucher;
  }

  private async validateVoucherVoting(
    request: IVoteCastRequest,
  ): Promise<VotingVoucher> {
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

    return voucher;
  }

  private async validatePublicVoting(
    request: IVoteCastRequest,
    voterIpHash: string,
  ) {
    const isIpUsed = await this.votesService.hasIpVotedInCampaign(
      request.dto.campaignId,
      voterIpHash,
    );

    if (isIpUsed) {
      throw new BadRequestException('Cannot vote multiple times');
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

  private async spendVoucher(voucher: VotingVoucher): Promise<void> {
    voucher.isSpent = true;

    const dto = VotingVoucherDto.map(voucher);

    await this.vouchersService.update(dto);
  }
}
