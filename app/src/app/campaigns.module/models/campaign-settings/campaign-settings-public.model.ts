import { VotingMechanism } from './campaign-settings.model';

export class CampaignSettingsPublic {
  votingMechanism: VotingMechanism;

  static map(dto: CampaignSettingsPublicDto): CampaignSettingsPublic {
    const entity = new CampaignSettingsPublic();

    entity.votingMechanism = dto.votingMechanism;

    return entity;
  }
}

export class CampaignSettingsPublicDto {
  votingMechanism: VotingMechanism;

  static map(entity: CampaignSettingsPublic): CampaignSettingsPublicDto {
    const dto = new CampaignSettingsPublicDto();

    dto.votingMechanism = VotingMechanism[entity.votingMechanism];

    return dto;
  }
}
