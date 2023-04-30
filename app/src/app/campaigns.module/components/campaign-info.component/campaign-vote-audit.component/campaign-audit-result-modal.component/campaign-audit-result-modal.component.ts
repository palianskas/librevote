import { Component, Input } from '@angular/core';
import { VoteAuditResult } from 'src/app/votes.module/models/vote-audit-result.model';
import { VotesService } from 'src/app/votes.module/services/votes.service';

@Component({
  selector: 'app-campaign-audit-result-modal',
  templateUrl: './campaign-audit-result-modal.component.html',
})
export class CampaignAuditResultModalComponent {
  @Input() campaignId: string;
  @Input() auditResult: VoteAuditResult;
  @Input() onInvalidation: (count: number) => void;

  isVoteRemovalDone = false;

  constructor(private readonly votesService: VotesService) {}

  async removeInvalidVotes(): Promise<void> {
    if (this.auditResult.invalidVotes?.length < 1) {
      return;
    }

    if (!confirm('Remove invalid votes?')) {
      return;
    }

    const count = await this.votesService.invalidate(
      this.campaignId,
      this.auditResult.invalidVotes.map((vote) => vote.id)
    );

    this.isVoteRemovalDone = true;

    this.onInvalidation(count);
  }

  openModal(): void {
    const button = document.getElementById('audit-result-modal-open-button');
    button.click();
  }

  closeModal(): void {
    const button = document.getElementById('audit-result-modal-close-button');
    button.click();
  }
}
