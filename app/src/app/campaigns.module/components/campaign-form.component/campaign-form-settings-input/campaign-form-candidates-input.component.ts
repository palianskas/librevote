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

  maxVoterCountOptions = [
    { key: 100, value: 100 },
    { key: 1000, value: 1000 },
    { key: 10000, value: 10000 },
    { key: 100000, value: 100000 },
    { key: 1000000, value: 1000000 },
    { key: 10000000, value: 10000000 },
  ];

  onChange(): void {
    this.onChangeCallback();
  }
}
