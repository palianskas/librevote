import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CampaignsService } from 'src/modules/campaigns.module/campaigns.service';
import { VotingMechanism } from 'src/modules/campaigns.module/models/campaign-settings/campaign-settings.model';
import { Campaign } from 'src/modules/campaigns.module/models/campaign/campaign.model';
import { IVoteCastRequest } from '../models/votes-contracts.model';
import { VotesService } from '../../votes.service';

@Injectable()
export class VoteCastHandler {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly votesService: VotesService,
  ) {}

  async handle(
    request: IVoteCastRequest,
    user: User | undefined,
  ): Promise<string> {
    const campaign = await this.campaignsService.get(request.dto.campaignId);

    this.validateRequest(request, campaign, user);

    const result = await this.votesService.create(request.dto);

    return result.id;
  }

  private validateRequest(
    request: IVoteCastRequest,
    campaign: Campaign | null,
    user: User | undefined,
  ): void {
    if (!campaign) {
      throw new NotFoundException(
        `Campaign not found by id: ${request.dto.campaignId}`,
      );
    }

    const votingMechanism = campaign.settings?.votingMechanism;

    if (!votingMechanism) {
      throw new Error(
        `Cannot determine voting settings for campaign ${campaign.id}`,
      );
    }

    switch (votingMechanism) {
      case VotingMechanism.InviteOnly: {
        this.validateInviteOnlyVoting(campaign, user);
        break;
      }
      case VotingMechanism.Voucher: {
        this.validateVoucherVoting(request);
        break;
      }
      default:
        // no validation
        break;
    }

    if (votingMechanism === VotingMechanism.InviteOnly) {
    }

    if (votingMechanism === VotingMechanism.Voucher) {
      this.validateVoucherVoting(request);
    }
  }

  private validateInviteOnlyVoting(
    campaign: Campaign,
    user: User | undefined,
  ): void {
    if (!user) {
      throw new BadRequestException(
        `Campaign ${campaign.id} voting is invite-only`,
      );
    }

    throw new NotImplementedException();
    // TODO: check if user is invited
  }

  private async validateVoucherVoting(
    request: IVoteCastRequest,
  ): Promise<void> {
    throw new NotImplementedException();
    // TODO: try to load voucher and check if it exists and is valid
  }
}
