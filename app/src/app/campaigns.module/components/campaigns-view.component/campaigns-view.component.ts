import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteNames } from 'src/app/app.module/app.routes';
import { Campaign } from '../../models/campaign.model';
import { CampaignsService } from '../../services/campaigns.service';

@Component({
  selector: 'app-campaigns-view',
  templateUrl: './campaigns-view.component.html',
  styleUrls: ['./campaigns-view.component.css'],
})
export class CampaignsViewComponent implements OnInit {
  campaigns: Campaign[];

  routeNames = RouteNames;

  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.campaigns = await this.campaignsService.fetchUserCampaigns();
  }

  open(id: string): void {
    this.router.navigate([RouteNames.campaigns.index, id]);
  }

  createNew(): void {
    // TODO: open modal w/ wizard
    console.log('new');
  }
}
