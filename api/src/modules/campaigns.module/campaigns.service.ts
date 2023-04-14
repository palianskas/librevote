import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CampaignsRepository } from './campaigns.repository';
import { CampaignUserRole } from './models/campaign-user/campaign-user-role.enum';
import { CampaignDto } from './models/campaign/campaign.dto';
import { Campaign } from './models/campaign/campaign.model';

@Injectable()
export class CampaignsService {
  constructor(private readonly campaignsRepository: CampaignsRepository) {}

  async get(id: string): Promise<Campaign | null> {
    const campaign = await this.campaignsRepository.get(id);

    return campaign;
  }

  async create(dto: CampaignDto): Promise<Campaign> {
    const campaign = this.campaignsRepository.create(dto);

    return campaign;
  }

  async update(dto: CampaignDto): Promise<Campaign> {
    const campaign = this.campaignsRepository.update(dto);

    return campaign;
  }

  hasReadAccess(user: User, campaign: Campaign): boolean {
    return !!campaign.campaignUsers?.some(
      (campaignUser) => campaignUser.userId === user.id,
    );
  }

  hasWriteAccess(user: User, campaign: Campaign): boolean {
    const campaignUser = campaign.campaignUsers?.find(
      (campaignUser) => campaignUser.userId === user.id,
    );

    return campaignUser?.role === CampaignUserRole.Admin;
  }

  hasVoteReadAccess(user: User, campaign: Campaign): boolean {
    return !!campaign.campaignUsers?.some(
      (campaignUser) => campaignUser.userId === user.id,
    );
  }

  hasVoteManagementAccess(user: User, campaign: Campaign): boolean {
    const campaignUser = campaign.campaignUsers?.find(
      (campaignUser) => campaignUser.userId === user.id,
    );

    return campaignUser?.role === CampaignUserRole.Admin;
  }

  hasVoucherCreateAccess(user: User, campaign: Campaign): boolean {
    return !!campaign.campaignUsers?.some(
      (campaignUser) => campaignUser.userId === user.id,
    );
  }

  isBeforeVotingStart(campaign: Campaign, now = new Date()): boolean {
    return !campaign.startDate || now < campaign.startDate;
  }

  isVotingActive(campaign: Campaign, now = new Date()): boolean {
    const isBeforeVotingStart = this.isBeforeVotingStart(campaign, now);
    const isBeforeVotingEnd = !campaign.endDate || now < campaign.endDate;

    return !isBeforeVotingStart && isBeforeVotingEnd;
  }
}
