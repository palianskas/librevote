import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Campaign } from 'src/app/campaigns.module/models/campaign.model';
import { VoteAuditService } from 'src/app/votes.module/services/vote-audit.service';
import { VotesService } from 'src/app/votes.module/services/votes.service';
import { CampaignPrivateKeyAccessModalComponent } from './campaign-key-access-modal.component/campaign-key-access-modal.component';
import { VoteAuditResult } from 'src/app/votes.module/models/vote-audit-result.model';
import { CampaignAuditResultModalComponent } from './campaign-audit-result-modal.component/campaign-audit-result-modal.component';

@Component({
  selector: 'app-campaign-vote-audit',
  templateUrl: './campaign-vote-audit.component.html',
})
export class CampaignVoteAuditComponent implements OnInit {
  @Input() campaign: Campaign;
  @Input() isUserAdmin: boolean;

  voteCount: number;
  privKey?: string;
  auditResult: VoteAuditResult;

  isRefreshInProgress = false;
  isAuditInProgress = false;

  @ViewChild(CampaignPrivateKeyAccessModalComponent)
  keyAccessModalChild: CampaignPrivateKeyAccessModalComponent;
  @ViewChild(CampaignAuditResultModalComponent)
  auditResultModalChild: CampaignAuditResultModalComponent;

  constructor(
    private readonly votesService: VotesService,
    private readonly voteAuditService: VoteAuditService
  ) {}

  async ngOnInit(): Promise<void> {
    this.voteCount = await this.fetchVoteCount(this.campaign.id);
  }

  public async refreshVoteCount(): Promise<void> {
    const count = await this.fetchVoteCount(this.campaign.id);

    this.isRefreshInProgress = true;

    setTimeout(() => {
      this.isRefreshInProgress = false;

      this.voteCount = count;
    }, 2000 + Math.random() * 2000);
  }

  public performVoteAudit(): void {
    if (!!this.privKey) {
      this.auditVotes();
    } else {
      this.keyAccessModalChild.onBeginAccessKey();
    }
  }

  public onPrivateKeyAccessed(key: string): void {
    this.privKey = key;

    this.auditVotes();
  }

  private async auditVotes(): Promise<void> {
    this.isAuditInProgress = true;
    this.auditResult = await this.voteAuditService.auditVotes(
      this.campaign.id,
      this.privKey
    );
    this.isAuditInProgress = false;

    this.auditResultModalChild.openModal();
  }

  private fetchVoteCount(campaignId: string): Promise<number> {
    return this.votesService.getCampaignVoteCount(campaignId);
  }
}
