export class VotingVoucher {
  id?: string;
  campaignId: string;
  issueDate: Date;
  validUntilDate?: Date;
  designatedUserId?: string;

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

    return entity;
  }
}

export class VotingVoucherDto {
  id?: string;
  campaignId: string;
  issueDate: Date;
  validUntilDate?: Date;
  designatedUserId?: string;

  static map(data: any): VotingVoucherDto {
    const dto = new VotingVoucherDto();

    dto.id = data.id;
    dto.campaignId = data.campaignId;
    dto.issueDate = data.issueDate;
    dto.validUntilDate = data.validUntilDate && new Date(data.validUntilDate);
    dto.designatedUserId = data.designatedUserId;

    return dto;
  }
}
