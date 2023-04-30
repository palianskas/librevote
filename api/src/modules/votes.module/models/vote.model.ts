import { Vote as VoteEntity } from '@prisma/client';

export type Vote = VoteEntity;

export class VoteDto {
  id?: string;
  campaignId: string;
  voucherId: string | null;
  value: string;
  createDate: Date;
  isInvalid: boolean;

  static map(entity: Vote): VoteDto {
    const dto = new VoteDto();

    dto.id = entity.id;
    dto.campaignId = entity.campaignId;
    dto.voucherId = entity.voucherId;
    dto.value = entity.value;
    dto.createDate = new Date(entity.createDate);
    dto.isInvalid = entity.isInvalid;

    return dto;
  }

  static mapList(entities: Vote[]): VoteDto[] {
    return entities.map((entity) => this.map(entity));
  }
}
