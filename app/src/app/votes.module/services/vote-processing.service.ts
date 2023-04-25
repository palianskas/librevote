import { Injectable } from '@angular/core';
import { VotesService } from './votes.service';
import { Vote } from '../models/vote.model';
import { CampaignsService } from 'src/app/campaigns.module/services/campaigns.service';
import * as bigInt from 'big-integer';
import { BigInteger } from 'big-integer';
import { Campaign } from 'src/app/campaigns.module/models/campaign.model';
import { VoteAuditResult } from '../models/vote-audit-result.model';
import { CampaignResults } from 'src/app/campaigns.module/models/campaign-results/campaign-results.model';
import {
  CampaignResultsContainer,
  CampaignVoteCountFailureStatus,
} from 'src/app/campaigns.module/models/campaign-results/campaign-results-container.model';
import { CampaignCandidate } from 'src/app/campaigns.module/models/campaign-candidates/campaign-candidate.model';
import { CandidateResults } from 'src/app/campaigns.module/models/campaign-results/candidate.results.model';
import { EncryptionDomainFactory } from 'src/app/encryption.module/services/encryption-domain/encryption-domain.factory';
import { EncryptionDomain } from 'src/app/encryption.module/services/encryption-domain/encryption.domain';

class VoteCountResult {
  totalVoteCount: number;
  candidateVoteCounts: number[];
}

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
    } catch (e) {
      return { isSuccessful: false };
    }
  }

  public async executeCampaignVoteCount(
    campaign: Campaign,
    privateKey: string
  ): Promise<CampaignResultsContainer> {
    const privKey = bigInt(privateKey);
    const pubKey = bigInt(campaign.pubKey);

    const paillierEncryptionDomain =
      this.encryptionDomainFactory.getPaillierEncryptionDomain(pubKey, privKey);

    const votes = await this.votesService.getAllCampaignVotes(campaign.id);
    const voteValues = votes.map((vote) => bigInt(vote.value));

    if (votes.length < 1) {
      const results: CampaignResultsContainer = {
        isCountSuccessful: true,
        results: {
          campaignId: campaign.id,
          totalVoteCount: '0',
        },
      };

      return results;
    }

    const failureStatus = this.validateCampaignCountOperation(
      pubKey,
      voteValues,
      campaign.settings.maxVoterCount,
      paillierEncryptionDomain
    );

    if (!!failureStatus) {
      const container: CampaignResultsContainer = {
        isCountSuccessful: false,
        failureStatus: failureStatus,
      };

      return container;
    }

    try {
      const results = this.countCampaignVotes(
        voteValues,
        campaign,
        paillierEncryptionDomain.decrypt.bind(paillierEncryptionDomain)
      );

      return { isCountSuccessful: true, results: results };
    } catch (e) {
      console.error(e);
      return {
        isCountSuccessful: false,
        failureStatus: CampaignVoteCountFailureStatus.Other,
      };
    }
  }

  private validateCampaignCountOperation(
    pubKey: BigInteger,
    encryptedVotes: BigInteger[],
    maxVoterCount: number,
    encryptionDomain: EncryptionDomain<BigInteger>
  ): CampaignVoteCountFailureStatus | null {
    if (!this.validateEncryptionDomainKeyPair(encryptionDomain)) {
      return CampaignVoteCountFailureStatus.KeyPairMismatch;
    }

    const areVotesValid = this.isVoteRangeValid(
      pubKey,
      maxVoterCount,
      encryptedVotes,
      0,
      encryptedVotes.length,
      encryptionDomain.decrypt.bind(encryptionDomain)
    );

    if (!areVotesValid) {
      return CampaignVoteCountFailureStatus.InvalidVotesDetected;
    }

    return null;
  }

  private countCampaignVotes(
    voteValues: BigInteger[],
    campaign: Campaign,
    decryptionFunc: (cipher: BigInteger) => BigInteger
  ): CampaignResults {
    const encryptedEncodedVotes = this.encodeVotes(
      voteValues,
      bigInt(campaign.pubKey)
    );

    const encodedVotes = decryptionFunc(encryptedEncodedVotes);

    const voteCountResults = this.countVotes(
      encodedVotes.toJSNumber(),
      campaign.settings.maxVoterCount,
      campaign.candidates.length
    );

    const candidateResults = this.getCandidateResults(
      voteCountResults.candidateVoteCounts,
      campaign.candidates
    );

    const results: CampaignResults = {
      campaignId: campaign.id,
      totalVoteCount: voteCountResults.totalVoteCount.toString(),
      candidateResults: candidateResults,
    };

    return results;
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

    const invalidIndices = this.validateVoteRange(
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

  private validateVoteRange(
    pubKey: BigInteger,
    maxVoterCount: number,
    encryptedVotes: BigInteger[],
    batchStartIndex: number,
    batchEndIndex: number,
    decryptionFunc: (cipher: BigInteger) => BigInteger
  ): number[] {
    if (
      this.isVoteRangeValid(
        pubKey,
        maxVoterCount,
        encryptedVotes,
        batchStartIndex,
        batchEndIndex,
        decryptionFunc
      )
    ) {
      return [];
    }

    const pivotIndex =
      batchStartIndex + Math.floor((batchEndIndex - batchStartIndex) / 2);

    if (batchEndIndex - batchStartIndex > 1) {
      const invalidLeftSideVoteIndices = this.validateVoteRange(
        pubKey,
        maxVoterCount,
        encryptedVotes,
        batchStartIndex,
        pivotIndex,
        decryptionFunc
      );
      const invalidRightSideIndices = this.validateVoteRange(
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

  private isVoteRangeValid(
    pubKey: BigInteger,
    maxVoterCount: number,
    encryptedVotes: BigInteger[],
    rangeStartIndex: number,
    rangeEndIndex: number,
    decryptionFunc: (cipher: BigInteger) => BigInteger
  ): boolean {
    const encryptedVoteAggregate = this.encodeVotes(
      encryptedVotes,
      pubKey,
      rangeStartIndex,
      rangeEndIndex
    );
    const value = decryptionFunc(encryptedVoteAggregate);

    const { totalVoteCount } = this.countVotes(
      value.toJSNumber(),
      maxVoterCount
    );

    return totalVoteCount === rangeEndIndex - rangeStartIndex;
  }

  private countVotes(
    encodedVotesValue: number,
    maxVoterCount: number,
    candidateCount = -1
  ): VoteCountResult {
    let totalVoteCount = 0;
    const candidateVoteCounts = [];

    while (true) {
      if (encodedVotesValue == 0) {
        for (let i = candidateVoteCounts.length; i < candidateCount; i++) {
          candidateVoteCounts.push(0);
        }

        break;
      }

      const candidateVoteCount = encodedVotesValue % maxVoterCount;

      candidateVoteCounts.push(candidateVoteCount);

      totalVoteCount += candidateVoteCount;

      encodedVotesValue -= candidateVoteCount;
      encodedVotesValue /= maxVoterCount;
    }

    return { totalVoteCount, candidateVoteCounts };
  }

  private encodeVotes(
    voteValues: BigInteger[],
    pubKey: BigInteger,
    startIndex = 0,
    endIndex = voteValues.length
  ): BigInteger {
    let voteAggregate = bigInt(voteValues[startIndex]);

    for (let i = startIndex + 1; i < endIndex; i++) {
      voteAggregate = voteAggregate.multiply(voteValues[i]).mod(pubKey.pow(2));
    }

    return voteAggregate;
  }

  private getCandidateResults(
    candidateVoteCounts: number[],
    candidates: CampaignCandidate[]
  ): CandidateResults[] {
    const results = candidates.map((candidate) => {
      const result: CandidateResults = {
        candidateId: candidate.id,
        voteCount: candidateVoteCounts[candidate.index].toString(),
      };

      return result;
    });

    return results;
  }

  private encryptCampaignResults(
    results: CampaignResults,
    encryptionDomain: EncryptionDomain<string>
  ): void {
    results.totalVoteCount = encryptionDomain.encrypt(results.totalVoteCount);

    results.candidateResults?.forEach(
      (result) =>
        (result.voteCount = encryptionDomain.encrypt(result.voteCount))
    );
  }
}
