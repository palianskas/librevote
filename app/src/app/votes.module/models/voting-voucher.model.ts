import { User, UserDto } from 'src/app/users.module/models/user.model';

export class VotingVoucher {
  id?: string;
  campaignId: string;
  issueDate: Date;
  validUntilDate?: Date;
  designatedUserId?: string;
  designatedUser?: User;

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
    entity.issueDate = dto.issueDate;
    entity.validUntilDate = dto.validUntilDate && new Date(dto.validUntilDate);
    entity.designatedUserId = dto.designatedUserId;

    entity.designatedUser = dto.designatedUser && User.map(dto.designatedUser);

    return entity;
  }
}

export class VotingVoucherDto {
  id?: string;
  campaignId: string;
  issueDate: Date;
  validUntilDate?: Date;
  designatedUserId?: string;
  designatedUser?: UserDto;

  static map(data: any): VotingVoucherDto {
    const dto = new VotingVoucherDto();

    dto.id = data.id;
    dto.campaignId = data.campaignId;
    dto.issueDate = data.issueDate;
    dto.validUntilDate = data.validUntilDate && new Date(data.validUntilDate);
    dto.designatedUserId = data.designatedUserId;

    dto.designatedUser =
      data.designatedUser && UserDto.map(data.designatedUser);

    return dto;
  }
}
