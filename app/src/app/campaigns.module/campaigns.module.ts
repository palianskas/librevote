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
import { CampaignFormSettingsInputComponent } from './components/campaign-form.component/campaign-form-settings-input/campaign-form-candidates-input.component';

@NgModule({
  declarations: [
    CampaignsViewComponent,
    CampaignInfoComponent,
    CampaignFormComponent,
    CampaignFormUsersInputComponent,
    CampaignPublicLinkViewComponent,
    CampaignFormCandidatesInputComponent,
    CampaignFormSettingsInputComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    CampaignsService,
    CampaignPublicLinksService,
    CampaignCandidatesService,
  ],
})
export class CampaignsModule {}
