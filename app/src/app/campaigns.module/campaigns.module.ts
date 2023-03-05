import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { CampaignsViewComponent } from './components/campaigns-view.component/campaigns-view.component';
import { CampaignInfoComponent } from './components/campaign-info.component/campaign-info.component';

@NgModule({
  declarations: [CampaignsViewComponent, CampaignInfoComponent],
  imports: [CommonModule, BrowserModule],
})
export class CampaignsModule {}
