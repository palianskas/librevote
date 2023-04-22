import { User, VotingVoucher as VotingVoucherEntity } from '@prisma/client';
import { CampaignPublicDto } from 'src/modules/campaigns.module/models/campaign/campaign.dto';
import { Campaign } from 'src/modules/campaigns.module/models/campaign/campaign.model';
import { UserDto } from 'src/modules/users.module/models/user.dto';

export type VotingVoucher = VotingVoucherEntity & {
  campaign: Campaign;
  designatedUser: User | null;
};

export class VotingVoucherDto {
  id?: string;
  campaignId: string;
  isSpent: boolean;
  issueDate: Date;
  validUntilDate?: Date;
  designatedUserId?: string;
  designatedUser?: UserDto;
  deleteDate: Date | null;
  campaign?: CampaignPublicDto;

  static map(entity: VotingVoucher): VotingVoucherDto {
    const dto = new VotingVoucherDto();

    dto.id = entity.id;
    dto.campaignId = entity.campaignId;
    dto.issueDate = entity.issueDate;
    dto.isSpent = entity.isSpent;

    if (!!entity.validUntilDate) {
      dto.validUntilDate = new Date(entity.validUntilDate);
    }
    if (!!entity.designatedUserId) {
      dto.designatedUserId = entity.designatedUserId;
    }
    if (!!entity.designatedUser) {
      dto.designatedUser = UserDto.map(entity.designatedUser);
    }
    if (!!entity.deleteDate) {
      dto.deleteDate = new Date(entity.deleteDate);
    }
    if (!!entity.campaign) {
      dto.campaign = CampaignPublicDto.map(entity.campaign);
    }

    return dto;
  }

  static mapList(entities: VotingVoucher[] | undefined): VotingVoucherDto[] {
    if (!entities) {
      return [];
    }

    return entities.map(VotingVoucherDto.map);
  }
}
