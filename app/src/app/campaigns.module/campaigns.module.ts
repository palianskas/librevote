import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { CampaignsViewComponent } from './components/campaigns-view.component.ts/campaigns-view.component';

@NgModule({
  declarations: [CampaignsViewComponent],
  imports: [CommonModule, BrowserModule],
})
export class CampaignsModule {}
