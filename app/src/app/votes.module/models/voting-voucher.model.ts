import { CampaignPublicDto } from 'src/app/campaigns.module/models/campaign-public.model';
import { User, UserDto } from 'src/app/users.module/models/user.model';

export class VotingVoucher {
  id?: string;
  campaignId: string;
  isSpent: boolean;
  issueDate: Date;
  validUntilDate?: Date;
  designatedUserId?: string;
  designatedUser?: User;
  deleteDate?: Date;

  get isValid(): boolean {
    const now = new Date();

    const isIssuedInPast = this.issueDate < now;
    const isExpired = !!this.validUntilDate && this.validUntilDate < now;

    return isIssuedInPast && !isExpired;
  }

  static map(dto: VotingVoucherDto): VotingVoucher {
    const entity = new VotingVoucher();

    entity.id = dto.id;
    entity.campaignId = dto.campaignId;
    entity.isSpent = dto.isSpent;
    entity.issueDate = new Date(dto.issueDate);
    entity.validUntilDate = dto.validUntilDate && new Date(dto.validUntilDate);
    entity.designatedUserId = dto.designatedUserId;
    entity.deleteDate = dto.deleteDate && new Date(dto.deleteDate);

    entity.designatedUser = dto.designatedUser && User.map(dto.designatedUser);

    return entity;
  }

  static mapList(dtos: VotingVoucherDto[] | undefined): VotingVoucher[] {
    if (!dtos) {
      return [];
    }

    return dtos.map(VotingVoucher.map);
  }
}

export class VotingVoucherDto {
  id?: string;
  campaignId: string;
  isSpent: boolean;
  issueDate: Date;
  validUntilDate?: Date;
  designatedUserId?: string;
  designatedUser?: UserDto;
  deleteDate?: Date;
  campaign: CampaignPublicDto;

  static map(data: Partial<VotingVoucherDto>): VotingVoucherDto {
    const dto = new VotingVoucherDto();

    dto.id = data.id;
    dto.campaignId = data.campaignId;
    dto.isSpent = data.isSpent;
    dto.issueDate = new Date(data.issueDate);
    dto.validUntilDate = data.validUntilDate && new Date(data.validUntilDate);
    dto.designatedUserId = data.designatedUserId;
    dto.deleteDate = data.deleteDate && new Date(data.deleteDate);
    dto.campaign = data.campaign && CampaignPublicDto.map(data.campaign);

    dto.designatedUser =
      data.designatedUser && UserDto.map(data.designatedUser);

    return dto;
  }
}
