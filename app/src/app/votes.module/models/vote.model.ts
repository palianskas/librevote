export class Vote {
  id?: string;
  campaignId: string;
  voucherId?: string;
  value: string;
  createDate: Date;
  isInvalid: boolean;

  static map(dto: VoteDto): Vote {
    const entity = new Vote();

    entity.id = dto.id;
    entity.campaignId = dto.campaignId;
    entity.voucherId = dto.voucherId;
    entity.value = dto.value;
    entity.createDate = new Date(dto.createDate);
    entity.isInvalid = dto.isInvalid;

    return entity;
  }

  static mapList(dtos: VoteDto[]): Vote[] {
    return dtos.map((dto) => this.map(dto));
  }
}

export class VoteDto {
  id?: string;
  campaignId: string;
  voucherId?: string;
  value: string;
  createDate: Date;
  isInvalid: boolean;

  static map(data: Partial<VoteDto>): VoteDto {
    const dto = new VoteDto();

    dto.id = data.id;
    dto.campaignId = data.campaignId;
    dto.voucherId = data.voucherId;
    dto.value = data.value;
    dto.createDate = new Date(data.createDate);
    dto.isInvalid = !!data.isInvalid;

    return dto;
  }

  static mapList(entities: Vote[]): VoteDto[] {
    return entities.map((entity) => this.map(entity));
  }
}
