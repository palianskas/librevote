import { VotingMechanism } from './campaign-settings.model';

export class CampaignSettingsPublic {
  votingMechanism: VotingMechanism;
  maxVoterCount: number;

  static map(dto: CampaignSettingsPublicDto): CampaignSettingsPublic {
    const entity = new CampaignSettingsPublic();

    entity.votingMechanism = dto.votingMechanism;
    entity.maxVoterCount = dto.maxVoterCount;

    return entity;
  }
}

export class CampaignSettingsPublicDto {
  votingMechanism: VotingMechanism;
  maxVoterCount: number;

  static map(entity: CampaignSettingsPublic): CampaignSettingsPublicDto {
    const dto = new CampaignSettingsPublicDto();

    dto.votingMechanism = VotingMechanism[entity.votingMechanism];
    dto.maxVoterCount = entity.maxVoterCount;

    return dto;
  }
}
