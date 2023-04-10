import { Injectable } from '@angular/core';
import { VotesService } from './votes.service';
import { Vote } from '../models/vote.model';
import { CampaignsService } from 'src/app/campaigns.module/services/campaigns.service';
import * as bigInt from 'big-integer';
import { BigInteger } from 'big-integer';
import { EncryptionDomainFactory } from 'src/app/encryption.module/encryption-domain/encryption-domain.factory';
import { Campaign } from 'src/app/campaigns.module/models/campaign.model';
import { EncryptionDomain } from 'src/app/encryption.module/encryption-domain/encryption.domain';
import { VoteAuditResult } from '../models/vote-audit-result.model';

@Injectable({
  providedIn: 'root',
})
export class VoteProcessingService {
  constructor(
    private readonly votesService: VotesService,
    private readonly campaignsService: CampaignsService,
    private readonly encryptionDomainFactory: EncryptionDomainFactory
  ) {}

  public async auditVotes(
    campaignId: string,
    privateKey: string
  ): Promise<VoteAuditResult> {
    const campaign = await this.campaignsService.get(campaignId);

    const votes = await this.votesService.getAllCampaignVotes(campaignId);

    try {
      const invalidVotes = await this.validateVotes(
        votes,
        campaign,
        privateKey
      );

      const result: VoteAuditResult = {
        isSuccessful: true,
        invalidVotes: invalidVotes,
      };

      return result;
    } catch {
      return { isSuccessful: false };
    }
  }

  private validateVotes(
    votes: Vote[],
    campaign: Campaign,
    privateKey: string
  ): Vote[] {
    const privKey = bigInt(privateKey);
    const pubKey = bigInt(campaign.pubKey);

    const encryptionDomain =
      this.encryptionDomainFactory.getPaillierEncryptionDomain(pubKey, privKey);

    if (!this.validateEncryptionDomainKeyPair(encryptionDomain)) {
      throw new Error('Encryption keys do not match');
    }

    if (votes.length < 1) {
      return [];
    }

    const encryptedVoteValues = votes.map((vote) => bigInt(vote.value));

    const invalidIndices = this.validateVotesBatch(
      pubKey,
      campaign.settings.maxVoterCount,
      encryptedVoteValues,
      0,
      votes.length,
      encryptionDomain.decrypt.bind(encryptionDomain)
    );

    const invalidVotes = invalidIndices.map((index) => votes[index]);

    return invalidVotes;
  }

  private validateEncryptionDomainKeyPair(
    encryptionDomain: EncryptionDomain<BigInteger>
  ): boolean {
    const value = bigInt[123];
    const cipher = encryptionDomain.encrypt(value);
    const decipher = encryptionDomain.decrypt(cipher);

    return value.eq(decipher);
  }

  private validateVotesBatch(
    pubKey: BigInteger,
    maxVoterCount: number,
    encryptedVotes: BigInteger[],
    batchStartIndex: number,
    batchEndIndex: number,
    decryptionFunc: (cipher: BigInteger) => BigInteger
  ): number[] {
    let encryptedVoteAggregate = encryptedVotes[batchStartIndex];

    for (let i = batchStartIndex + 1; i < batchEndIndex; i++) {
      encryptedVoteAggregate = encryptedVoteAggregate
        .multiply(encryptedVotes[i])
        .mod(pubKey.pow(2));
    }

    const value = decryptionFunc(encryptedVoteAggregate);

    const voteCount = this.getVoteCount(value.toJSNumber(), maxVoterCount);

    if (voteCount === batchEndIndex - batchStartIndex) {
      return [];
    }

    const pivotIndex =
      batchStartIndex + Math.floor((batchEndIndex - batchStartIndex) / 2);

    if (batchEndIndex - batchStartIndex > 1) {
      const invalidLeftSideVoteIndices = this.validateVotesBatch(
        pubKey,
        maxVoterCount,
        encryptedVotes,
        batchStartIndex,
        pivotIndex,
        decryptionFunc
      );
      const invalidRightSideIndices = this.validateVotesBatch(
        pubKey,
        maxVoterCount,
        encryptedVotes,
        pivotIndex,
        batchEndIndex,
        decryptionFunc
      );

      return invalidLeftSideVoteIndices.concat(invalidRightSideIndices);
    } else {
      return [batchStartIndex];
    }
  }

  private getVoteCount(
    encodedVotesValue: number,
    maxVoterCount: number
  ): number {
    let totalVoteCount = 0;

    while (true) {
      if (encodedVotesValue == 0) {
        break;
      }

      const candidateVoteCount = encodedVotesValue % maxVoterCount;

      totalVoteCount += candidateVoteCount;

      encodedVotesValue -= candidateVoteCount;
      encodedVotesValue /= maxVoterCount;
    }

    return totalVoteCount;
  }
}
