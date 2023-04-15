import { Component, Input } from '@angular/core';
import { VoucherContainer } from 'src/app/votes.module/models/voucher-container.model';
import * as QRcode from 'qrcode';
import { StringHelpers } from 'src/app/encryption.module/string.helpers';

@Component({
  selector: 'app-campaign-voucher-display-modal',
  templateUrl: './campaign-voucher-display-modal.component.html',
  styleUrls: ['./campaign-voucher-display-modal.component.css'],
})
export class CampaignVoucherDisplayModalComponent {
  voucherContainer: VoucherContainer;

  init(voucherContainer: VoucherContainer): void {
    this.voucherContainer = voucherContainer;

    this.generateVoucherQrCode();
  }

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

  formatDate(date: Date): string {
    return StringHelpers.dateTimeToString(date);
  }

  private generateVoucherQrCode(): void {
    const canvas = document.getElementById('qrcode-canvas');

    QRcode.toCanvas(canvas, this.voucherContainer.votingLink);
  }
}
