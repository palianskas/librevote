import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CampaignSettings,
  VotingMechanism,
} from 'src/app/campaigns.module/models/campaign-settings/campaign-settings.model';

@Component({
  selector: 'app-campaign-form-settings-input',
  templateUrl: './campaign-form-candidates-input.component.html',
})
export class CampaignFormSettingsInputComponent {
  @Input() onChangeCallback: Function;
  @Input() settings: CampaignSettings;
  @Output() settingsChange = new EventEmitter<CampaignSettings>();

  votingMechanismOptions = [
    { key: VotingMechanism.Public, value: 'Public' },
    { key: VotingMechanism.Voucher, value: 'Voucher' },
    { key: VotingMechanism.InviteOnly, value: 'Invite only' },
  ];

  onChange(): void {
    this.onChangeCallback();
  }
}
