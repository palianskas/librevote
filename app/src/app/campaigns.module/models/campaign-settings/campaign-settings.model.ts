import { CampaignDto } from '../campaign.model';

export enum VotingMechanism {
  Public = 'Public',
  Voucher = 'Voucher',
  InviteOnly = 'InviteOnly',
}

export class CampaignSettings {
  id?: string;
  campaignId?: string;
  campaign?: CampaignDto;
  votingMechanism: VotingMechanism;
  isManualVoteStartEndEnabled: boolean;

  static map(dto: CampaignSettingsDto): CampaignSettings {
    const entity = new CampaignSettings();

    entity.id = dto.id;
    entity.campaignId = dto.campaignId;
    entity.votingMechanism = VotingMechanism[dto.votingMechanism];
    entity.isManualVoteStartEndEnabled = dto.isManualVoteStartEndEnabled;

    if (!!dto.campaign) {
      entity.campaign = CampaignDto.map(dto.campaign);
    }

    return entity;
  }

  static get default(): CampaignSettings {
    const defaultSettings: CampaignSettingsDto = {
      votingMechanism: VotingMechanism.Public,
      isManualVoteStartEndEnabled: false,
    };

    return defaultSettings;
  }
}

export class CampaignSettingsDto {
  id?: string;
  campaignId?: string;
  campaign?: CampaignDto;
  votingMechanism: VotingMechanism;
  isManualVoteStartEndEnabled: boolean;

  static map(entity: CampaignSettings): CampaignSettingsDto {
    const dto = new CampaignSettingsDto();

    dto.id = entity.id;
    dto.campaignId = entity.campaignId;
    dto.votingMechanism = VotingMechanism[entity.votingMechanism];
    dto.isManualVoteStartEndEnabled = entity.isManualVoteStartEndEnabled;

    if (!!entity.campaign) {
      dto.campaign = CampaignDto.map(entity.campaign);
    }

    return dto;
  }

  static get default() {
    return this.map(CampaignSettings.default);
  }
}
