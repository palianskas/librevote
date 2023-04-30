export class CampaignCandidatePublic {
  id: string;
  name: string;
  description: string;
  index: number;
  campaignId: string;

  static map(dto: CampaignCandidatePublicDto): CampaignCandidatePublic {
    const entity = new CampaignCandidatePublic();

    entity.id = dto.id;
    entity.name = dto.name;
    entity.description = dto.description;
    entity.index = dto.index;

    entity.campaignId = dto.campaignId;

    return entity;
  }

  static mapList(
    dtos: CampaignCandidatePublicDto[] | undefined
  ): CampaignCandidatePublic[] {
    if (!dtos) {
      return [];
    }

    return dtos.map((dto) => this.map(dto));
  }
}

export class CampaignCandidatePublicDto {
  id: string;
  name: string;
  description: string;
  index: number;
  campaignId: string;

  static map(
    data: Partial<CampaignCandidatePublicDto>
  ): CampaignCandidatePublicDto {
    const dto = new CampaignCandidatePublicDto();

    dto.id = data.id;
    dto.name = data.name;
    dto.description = data.description;
    dto.index = data.index;

    dto.campaignId = data.campaignId;

    return dto;
  }

  static mapList(
    entries: Partial<CampaignCandidatePublicDto>[] | undefined
  ): CampaignCandidatePublicDto[] {
    if (!entries) {
      return [];
    }

    return entries.map((entry) => this.map(entry));
  }
}
