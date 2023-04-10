import { Component, Input, ViewChild } from '@angular/core';
import { RouteNames } from 'src/app/app.module/app.routes';
import { Campaign } from 'src/app/campaigns.module/models/campaign.model';
import { VotingVoucher } from 'src/app/votes.module/models/voting-voucher.model';
import { VoucherContainer } from 'src/app/votes.module/models/voucher-container.model';
import { VotingVouchersService } from 'src/app/votes.module/services/vouchers.service';
import { CampaignVoucherDisplayModalComponent } from './campaign-voucher-display-modal.component/campaign-voucher-display-modal.component';

@Component({
  selector: 'app-campaign-voucher-dispensery',
  templateUrl: './campaign-voucher-dispensery.component.html',
})
export class CampaignVoucherDispenseryComponent {
  @Input() campaign: Campaign;

  voucherContainer?: VoucherContainer;

  @ViewChild(CampaignVoucherDisplayModalComponent)
  voucherDisplayModalChild: CampaignVoucherDisplayModalComponent;

  constructor(private readonly vouchersService: VotingVouchersService) {}

  async onCreateVoucher(): Promise<void> {
    const voucher = await this.buildVoucher(this.campaign.id, 15);

    voucher.id = await this.vouchersService.create(voucher);

    const link = this.generateVoucherVotingLink(voucher.id);

    this.voucherContainer = {
      voucher: voucher,
      votingLink: link,
    };

    this.voucherDisplayModalChild.init(this.voucherContainer);
    this.voucherDisplayModalChild.openModal();
  }

  private async buildVoucher(
    campaignId: string,
    voucherDurationMins: number
  ): Promise<VotingVoucher> {
    const voucherExpirationDate = new Date();
    voucherExpirationDate.setMinutes(
      voucherExpirationDate.getMinutes() + voucherDurationMins
    );

    const voucher: VotingVoucher = {
      campaignId: campaignId,
      issueDate: new Date(),
      isValid: true,
      validUntilDate: voucherExpirationDate,
      isSpent: false,
    };

    return voucher;
  }

  private generateVoucherVotingLink(voucherId: string): string {
    const rootUrl = location.origin;

    const voucherVotingLink = `${rootUrl}/${RouteNames.vote.index}/${this.campaign.publicLink.link}?voucherId=${voucherId}`;

    return voucherVotingLink;
  }
}
