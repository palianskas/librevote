import { Campaign, CampaignDto } from '../campaign.model';

export enum VotingMechanism {
  Public = 'Public',
  Voucher = 'Voucher',
  InviteOnly = 'InviteOnly',
}

export class CampaignSettings {
  id?: string;
  campaignId?: string;
  campaign?: Campaign;
  votingMechanism: VotingMechanism;
  isManualVoteStartEndEnabled: boolean;
  maxVoterCount: number;

  static map(dto: CampaignSettingsDto): CampaignSettings {
    const entity = new CampaignSettings();

    entity.id = dto.id;
    entity.campaignId = dto.campaignId;
    entity.votingMechanism = VotingMechanism[dto.votingMechanism];
    entity.isManualVoteStartEndEnabled = dto.isManualVoteStartEndEnabled;
    entity.maxVoterCount = dto.maxVoterCount;

    if (!!dto.campaign) {
      entity.campaign = Campaign.map(dto.campaign);
    }

    return entity;
  }

  static get default(): CampaignSettings {
    const defaultSettings: CampaignSettings = {
      votingMechanism: VotingMechanism.Public,
      isManualVoteStartEndEnabled: false,
      maxVoterCount: 100,
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
  maxVoterCount: number;

  static map(data: Partial<CampaignSettingsDto>): CampaignSettingsDto {
    const dto = new CampaignSettingsDto();

    dto.id = data.id;
    dto.campaignId = data.campaignId;
    dto.votingMechanism = VotingMechanism[data.votingMechanism];
    dto.isManualVoteStartEndEnabled = data.isManualVoteStartEndEnabled;
    dto.maxVoterCount = data.maxVoterCount;

    if (!!data.campaign) {
      dto.campaign = CampaignDto.map(data.campaign);
    }

    return dto;
  }

  static get default() {
    return this.map(CampaignSettings.default);
  }
}
