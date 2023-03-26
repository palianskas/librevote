import { CampaignSettings as CampaignSettingsEntity } from '@prisma/client';
import { CampaignDto } from '../campaign/campaign.dto';
import { Campaign } from '../campaign/campaign.model';

export enum VotingMechanism {
  Public = 'Public',
  Voucher = 'Voucher',
  InviteOnly = 'InviteOnly',
}

export type CampaignSettings = CampaignSettingsEntity & {
  campaign?: Campaign | null;
};

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

  static get default(): CampaignSettingsDto {
    const defaultSettings: CampaignSettingsDto = {
      votingMechanism: VotingMechanism.Public,
      isManualVoteStartEndEnabled: false,
    };

    return defaultSettings;
  }
}

export class CampaignSettingsPublicDto {
  votingMechanism: VotingMechanism;

  static map(entity: CampaignSettings): CampaignSettingsPublicDto {
    const dto = new CampaignSettingsPublicDto();

    dto.votingMechanism = VotingMechanism[entity.votingMechanism];

    return dto;
  }
}
