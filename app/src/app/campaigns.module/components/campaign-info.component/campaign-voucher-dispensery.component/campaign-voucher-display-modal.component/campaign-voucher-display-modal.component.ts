import { Component, Input } from '@angular/core';
import { VoucherContainer } from 'src/app/votes.module/models/voucher-container.model';

@Component({
  selector: 'app-campaign-voucher-display-modal',
  templateUrl: './campaign-voucher-display-modal.component.html',
})
export class CampaignVoucherDisplayModalComponent {
  @Input() voucherContainer: VoucherContainer;

  constructor() {}

  openModal(): void {
    const button = document.getElementById('voucher-display-modal-open-button');
    button.click();
  }

  closeModal(): void {
    const button = document.getElementById(
      'voucher-display-modal-close-button'
    );
    button.click();
  }
}
