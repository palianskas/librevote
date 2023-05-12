import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteNames } from 'src/app/app.module/app.routes';
import { StringHelpers } from 'src/app/encryption.module/string.helpers';
import { VotingVoucher } from '../../models/voting-voucher.model';
import { VotingVouchersService } from '../../services/vouchers.service';
import { CampaignPublicDto } from 'src/app/campaigns.module/models/campaign-public.model';

@Component({
  selector: 'app-voting-invites-view',
  templateUrl: './voting-invites-view.component.html',
})
export class VotingInvitesViewComponent implements OnInit {
  invites: VotingVoucher[];

  routeNames = RouteNames;

  constructor(
    private readonly voucherService: VotingVouchersService,
    private readonly router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const response = await this.voucherService.getPending();
    this.invites = VotingVoucher.mapList(response.dtos);
  }

  open(campaign: CampaignPublicDto): void {
    this.router.navigate([RouteNames.vote.index, campaign.publicLink]);
  }

  getDisplayableDate(date?: Date): string {
    return !!date ? StringHelpers.dateTimeToString(date) : '-';
  }
}
