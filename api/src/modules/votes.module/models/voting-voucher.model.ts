import { User, VotingVoucher as VotingVoucherEntity } from '@prisma/client';
import { Campaign } from 'src/modules/campaigns.module/models/campaign/campaign.model';

export type VotingVoucher = VotingVoucherEntity & {
  campaign: Campaign;
  designatedUser?: User;
};
