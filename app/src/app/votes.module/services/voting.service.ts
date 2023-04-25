import { Injectable } from '@angular/core';
import * as bigInt from 'big-integer';
import { BigInteger } from 'big-integer';
import { CampaignCandidatePublic } from 'src/app/campaigns.module/models/campaign-candidates/campaign-candidate-public.model';
import { CampaignPublic } from 'src/app/campaigns.module/models/campaign-public.model';
import { VotingMechanism } from 'src/app/campaigns.module/models/campaign-settings/campaign-settings.model';
import { User } from 'src/app/users.module/models/user.model';
import { Vote } from '../models/vote.model';
import { VotesService } from './votes.service';
import { VotingVoucher } from '../models/voting-voucher.model';
import { VoteCastResponse } from '../models/vote-cast-response.model';
import { VoteCastError } from '../models/vote-cast-error.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { EncryptionDomainFactory } from 'src/app/encryption.module/services/encryption-domain/encryption-domain.factory';

@Injectable({
  providedIn: 'root',
})
export class VotingService {
  constructor(
    private readonly votesService: VotesService,
    private readonly encryptionDomainFactory: EncryptionDomainFactory
  ) {}

  public async castVote(
    campaign: CampaignPublic,
    candidate: CampaignCandidatePublic,
    voucher?: VotingVoucher,
    user?: User
  ): Promise<VoteCastResponse> {
    if (!this.canCastVote(campaign, voucher, user)) {
      return null;
    }

    const vote = this.buildVote(campaign, candidate, voucher?.id);

    try {
      const id = await this.votesService.create(vote);

      const response: VoteCastResponse = {
        isSuccessful: true,
        voteId: id,
      };

      return response;
    } catch (e) {
      const errorId = this.resolveErrorId(e);

      const response: VoteCastResponse = {
        isSuccessful: false,
        error: errorId,
      };

      return response;
    }
  }

  canCastVote(
    campaign?: CampaignPublic,
    voucher?: VotingVoucher,
    user?: User
  ): boolean {
    const votingMechanism = campaign?.settings?.votingMechanism;

    switch (votingMechanism) {
      case VotingMechanism.Public: {
        return true;
      }
      case VotingMechanism.Voucher: {
        return this.canCastVoucherVote(voucher);
      }
      case VotingMechanism.InviteOnly: {
        return this.canCastInviteOnlyVote(user);
      }
      default: {
        return false;
      }
    }
  }

  private buildVote(
    campaign: CampaignPublic,
    candidate: CampaignCandidatePublic,
    voucherId?: string
  ): Vote {
    const vote = new Vote();

    vote.campaignId = campaign.id;
    vote.createDate = new Date();
    vote.voucherId = voucherId;

    const voteValue = this.resolveVoteValue(
      candidate.index,
      campaign.settings.maxVoterCount
    );

    const pubKey = bigInt(campaign.pubKey!);

    const encryptedVoteValue = this.encryptVote(voteValue, pubKey);

    vote.value = encryptedVoteValue.toString();

    return vote;
  }

  private resolveVoteValue(
    candidateIndex: number,
    maxVoterCount: number
  ): BigInteger {
    const value = bigInt(maxVoterCount).pow(candidateIndex);

    return value;
  }

  private encryptVote(vote: BigInteger, pubKey: BigInteger): BigInteger {
    const privKey = bigInt.one; // stub

    const encryptionDomain =
      this.encryptionDomainFactory.getPaillierEncryptionDomain(pubKey, privKey);

    const encryptedVote = encryptionDomain.encrypt(vote);

    return encryptedVote;
  }

  private canCastVoucherVote(voucher?: VotingVoucher): boolean {
    return !!voucher && voucher.isSpent === false && voucher.isValid === true;
  }

  private canCastInviteOnlyVote(user?: User): boolean {
    return !!user;
  }

  private resolveErrorId(error: HttpErrorResponse | any): VoteCastError | null {
    switch (error?.error?.message) {
      case VoteCastError.SpamDetected:
        return VoteCastError.SpamDetected;
      default:
        return VoteCastError.Other;
    }
  }
}
