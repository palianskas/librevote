import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { CampaignsViewComponent } from './components/campaigns-view.component/campaigns-view.component';
import { CampaignInfoComponent } from './components/campaign-info.component/campaign-info.component';
import { RouterModule } from '@angular/router';
import { CampaignFormComponent } from './components/campaign-form.component/campaign-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CampaignFormUsersInputComponent } from './components/campaign-form.component/campaign-form-users-input/campaign-form-users-input.component';

@NgModule({
  declarations: [
    CampaignsViewComponent,
    CampaignInfoComponent,
    CampaignFormComponent,
    CampaignFormUsersInputComponent,
  ],
  imports: [CommonModule, BrowserModule, RouterModule, ReactiveFormsModule],
})
export class CampaignsModule {}
