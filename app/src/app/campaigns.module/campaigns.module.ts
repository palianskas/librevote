import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { CampaignsViewComponent } from './components/campaigns-view.component/campaigns-view.component';
import { CampaignInfoComponent } from './components/campaign-info.component/campaign-info.component';
import { RouterModule } from '@angular/router';
import { CampaignFormComponent } from './components/campaign-form.component/campaign-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CampaignFormUsersInputComponent } from './components/campaign-form.component/campaign-form-users-input/campaign-form-users-input.component';
import { CampaignPublicLinkViewComponent } from './components/campaign-public-link-view.component/campaign-public-link-view.component';
import { CampaignFormCandidatesInputComponent } from './components/campaign-form.component/campaign-form-candidates-input/campaign-form-candidates-input.component';
import { CampaignsService } from './services/campaigns.service';
import { CampaignPublicLinksService } from './services/campaign-public-links.service';
import { CampaignCandidatesService } from './services/campaign-candidates.service';
import { CampaignFormSettingsInputComponent } from './components/campaign-form.component/campaign-form-settings-input/campaign-form-settings-input.component';
import { CampaignEncryptionKeysComponent } from './components/campaign-info.component/campaign-encryption-keys.component/campaign-encryption-keys.component';
import { CampaignEncryptionKeysModalComponent } from './components/campaign-info.component/campaign-encryption-keys.component/campaign-encryption-keys-modal.component/campaign-encryption-keys-modal.component';
import { CampaignPrivateKeyRevealModalComponent } from './components/campaign-info.component/campaign-encryption-keys.component/campaign-key-reveal-modal.component/campaign-key-reveal-modal.component';
import { CampaignVoterInputComponent } from './components/campaign-info.component/campaign-voter-input.component/campaign-voter-input.component';
import { VotesModule } from '../votes.module/votes.module';
import { CampaignVotingControlComponent } from './components/campaign-info.component/campaign-voting-start.component/campaign-voting-control.component';
import { CampaignVoteAuditComponent } from './components/campaign-info.component/campaign-vote-audit.component/campaign-vote-audit.component';
import { CampaignPermissionsService } from './services/campaign-permissions.service';
import { CampaignPrivateKeyAccessModalComponent } from './components/campaign-info.component/campaign-vote-audit.component/campaign-key-access-modal.component/campaign-key-access-modal.component';
import { CampaignAuditResultModalComponent } from './components/campaign-info.component/campaign-vote-audit.component/campaign-audit-result-modal.component/campaign-audit-result-modal.component';

@NgModule({
  declarations: [
    CampaignsViewComponent,
    CampaignInfoComponent,
    CampaignFormComponent,
    CampaignFormUsersInputComponent,
    CampaignPublicLinkViewComponent,
    CampaignFormCandidatesInputComponent,
    CampaignFormSettingsInputComponent,
    CampaignEncryptionKeysComponent,
    CampaignEncryptionKeysModalComponent,
    CampaignPrivateKeyRevealModalComponent,
    CampaignVoterInputComponent,
    CampaignVotingControlComponent,
    CampaignVoteAuditComponent,
    CampaignPrivateKeyAccessModalComponent,
    CampaignAuditResultModalComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    VotesModule,
  ],
  providers: [
    CampaignsService,
    CampaignPublicLinksService,
    CampaignCandidatesService,
    CampaignPermissionsService,
  ],
})
export class CampaignsModule {}
