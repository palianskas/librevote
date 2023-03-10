import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouteNames } from 'src/app/app.module/app.routes';
import { Campaign, CampaignDto } from '../../models/campaign.model';
import { CampaignsService } from '../../services/campaigns.service';

@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
})
export class CampaignFormComponent {
  campaign: Campaign;

  formSubmitted = false;
  isLoginInvalid = false;

  campaignForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    pubKey: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly router: Router
  ) {}

  get name(): FormControl<string> {
    return this.campaignForm.controls.name;
  }
  get pubKey(): FormControl<string> {
    return this.campaignForm.controls.pubKey;
  }

  async create() {
    this.formSubmitted = true;

    if (this.campaignForm.invalid) {
      return;
    }

    const dto: CampaignDto = {
      name: this.name.value,
      pubKey: this.pubKey.value,
      campaignUsers: [],
    };

    const id = await this.campaignsService.create(dto);

    this.router.navigate([RouteNames.campaigns.index, id]);
  }

  isInputInvalid(control: FormControl): boolean {
    return (this.formSubmitted || control.touched) && control.invalid;
  }
}
