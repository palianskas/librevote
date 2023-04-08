import { Component, Input, OnInit } from '@angular/core';
import { VoteAuditResult } from 'src/app/votes.module/models/vote-audit-result.model';
import { VotesService } from 'src/app/votes.module/services/votes.service';

@Component({
  selector: 'app-campaign-audit-result-modal',
  templateUrl: './campaign-audit-result-modal.component.html',
})
export class CampaignAuditResultModalComponent {
  @Input() campaignId: string;
  @Input() auditResult: VoteAuditResult;

  async removeInvalidVotes(): Promise<void> {
    if (!confirm('Remove invalid votes?')) {
      return;
    }

    throw new Error('Not implemented');
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
