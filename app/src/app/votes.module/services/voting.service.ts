import { Injectable } from '@angular/core';
import * as bigInt from 'big-integer';
import { BigInteger } from 'big-integer';
import { CampaignCandidatePublic } from 'src/app/campaigns.module/models/campaign-candidates/campaign-candidate-public.model';
import { CampaignPublic } from 'src/app/campaigns.module/models/campaign-public.model';
import { VotingMechanism } from 'src/app/campaigns.module/models/campaign-settings/campaign-settings.model';
import { EncryptionService } from 'src/app/encryption.module/services/encryption.service';
import { User } from 'src/app/users.module/models/user.model';
import { Vote } from '../models/vote.model';
import { VotingVoucher } from '../models/voting-voucher.model';
import { VotesService } from './votes.service';

@Injectable({
  providedIn: 'root',
})
export class VotingService {
  private static readonly _maxCampaignVoterCount = Math.pow(2, 32); // TODO: add a selection to campaign form?

  constructor(private readonly votesService: VotesService) {}

  public async castVote(
    campaign: CampaignPublic,
    candidate: CampaignCandidatePublic,
    voucher?: VotingVoucher,
    user?: User
  ): Promise<string | null> {
    if (!this.canCastVote(campaign, voucher, user)) {
      return null;
    }

    const vote = this.buildVote(campaign, candidate);

    try {
      const id = await this.votesService.create(vote);

      return id;
    } catch (e) {
      return null;
    }
  }

  private buildVote(
    campaign: CampaignPublic,
    candidate: CampaignCandidatePublic
  ): Vote {
    const vote = new Vote();

    vote.campaignId = campaign.id;
    vote.createDate = new Date();

    const voteValue = this.resolveVoteValue(candidate.index);

    const pubKey = bigInt(campaign.pubKey!);

    const encryptedVoteValue = EncryptionService.encryptPaillier(
      voteValue,
      pubKey
    );

    vote.value = encryptedVoteValue.toString();

    return vote;
  }

  private resolveVoteValue(candidateIndex: number): BigInteger {
    const value = bigInt(VotingService._maxCampaignVoterCount).pow(
      candidateIndex
    );

    return value;
  }

  private canCastVote(
    campaign: CampaignPublic,
    voucher?: VotingVoucher,
    user?: User
  ): boolean {
    const votingMechanism = campaign.settings?.votingMechanism;

    switch (votingMechanism) {
      case VotingMechanism.Public: {
        return true;
      }
      case VotingMechanism.Voucher: {
        return this.canCastVoucherVote(campaign, voucher);
      }
      case VotingMechanism.InviteOnly: {
        return this.canCastInviteOnlyVote(campaign, voucher, user);
      }
      default: {
        return false;
      }
    }
  }

  private canCastVoucherVote(
    campaign: CampaignPublic,
    voucher?: VotingVoucher
  ): boolean {
    return voucher.isValid && voucher?.campaignId === campaign.id;
  }

  private canCastInviteOnlyVote(
    campaign: CampaignPublic,
    voucher?: VotingVoucher,
    user?: User
  ): boolean {
    if (!user) {
      return false;
    }

    if (!voucher?.designatedUserId) {
      return false;
    }

    return (
      voucher.isValid &&
      voucher.campaignId === campaign.id &&
      voucher.designatedUserId === user.id
    );
  }
}
