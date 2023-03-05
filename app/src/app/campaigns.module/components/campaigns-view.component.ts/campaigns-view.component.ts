import { Component, OnInit } from '@angular/core';
import { Campaign } from '../../models/campaign.model';
import { CampaignsService } from '../../services/campaigns.service';

@Component({
  selector: 'app-campaigns-view',
  templateUrl: './campaigns-view.component.html',
})
export class CampaignsViewComponent implements OnInit {
  campaigns: Campaign[];

  constructor(private readonly campaignsService: CampaignsService) {}
  async ngOnInit(): Promise<void> {
    this.campaigns = await this.campaignsService.fetchUserCampaigns();
  }
}
