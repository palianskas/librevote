import { User, VotingVoucher as VotingVoucherEntity } from '@prisma/client';
import { Campaign } from 'src/modules/campaigns.module/models/campaign/campaign.model';
import { UserDto } from 'src/modules/users.module/models/user.dto';

export type VotingVoucher = VotingVoucherEntity & {
  campaign: Campaign;
  designatedUser: User | null;
};

export class VotingVoucherDto {
  id?: string;
  campaignId: string;
  issueDate: Date;
  validUntilDate?: Date;
  designatedUserId?: string;
  designatedUser?: UserDto;

  static map(entity: VotingVoucher): VotingVoucherDto {
    const dto = new VotingVoucherDto();

    dto.id = entity.id;
    dto.campaignId = entity.campaignId;
    dto.issueDate = entity.issueDate;

    if (!!entity.validUntilDate) {
      dto.validUntilDate = new Date(entity.validUntilDate);
    }
    if (!!entity.designatedUserId) {
      dto.designatedUserId = entity.designatedUserId;
    }
    if (!!entity.designatedUser) {
      dto.designatedUser = UserDto.map(entity.designatedUser);
    }

    return dto;
  }
}
