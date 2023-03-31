import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CampaignsService } from 'src/modules/campaigns.module/campaigns.service';
import { Campaign } from 'src/modules/campaigns.module/models/campaign/campaign.model';
import { UsersService } from 'src/modules/users.module/users.service';
import { VotingVoucherDto } from '../../models/voting-voucher.model';
import { VouchersService } from '../../vouchers.service';
import {
  IBulkVoteVoucherCreateRequest,
  IVoteVoucherCreateRequest,
} from '../models/vote-vouchers-contracts.model';

@Injectable()
export class VoucherCreateHandler {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly vouchersService: VouchersService,
    private readonly usersService: UsersService,
  ) {}

  async handle(
    request: IVoteVoucherCreateRequest,
    user: User,
  ): Promise<string> {
    const campaign = await this.campaignsService.get(request.campaignId);

    this.validateRequest(request, campaign, user);

    const result = await this.vouchersService.create(request.dto);

    return result.id;
  }

  async handleForBulkAction(
    request: IBulkVoteVoucherCreateRequest,
    user: User,
  ): Promise<number> {
    const campaign = await this.campaignsService.get(request.campaignId);

    this.validateRequest(request, campaign, user);

    const dtos = await this.buildVoucherDtos(
      request.campaignId,
      request.usernames,
    );

    const result = this.vouchersService.createMany(dtos);

    return result;
  }

  private async buildVoucherDtos(
    campaignId: string,
    usernames: string[],
  ): Promise<VotingVoucherDto[]> {
    const users = await this.usersService.searchByEmails(usernames);

    const usersMap: { [username: string]: User } = {};

    users.forEach((user) => {
      usersMap[user.email] = user;
    });

    const now = new Date();

    const dtos: VotingVoucherDto[] = usernames.map((username) => {
      return {
        campaignId: campaignId,
        designatedUserId: usersMap[username].id,
        issueDate: now,
      };
    });

    return dtos;
  }

  private validateRequest(
    request: IVoteVoucherCreateRequest | IBulkVoteVoucherCreateRequest,
    campaign: Campaign | null,
    user: User,
  ): void {
    if (!campaign) {
      throw new NotFoundException(
        `Campaign not found by id: ${request.campaignId}`,
      );
    }

    if (!this.campaignsService.isVotingActive(campaign)) {
      throw new BadRequestException(
        `Voting is not active for campaign ${campaign.id}`,
      );
    }

    if (!this.campaignsService.hasVoucherCreateAccess(user, campaign)) {
      throw new ForbiddenException(
        `User does not have access to create voting vouchers for campaign ${campaign.id}`,
      );
    }
  }
}
