import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouteNames } from 'src/app/app.module/app.routes';
import { CampaignPublicLinkDto } from '../../models/campaign-public-links/campaign-public-link.model';
import { CampaignUserDto } from '../../models/campaign-user.model';
import { CampaignDto } from '../../models/campaign.model';
import { CampaignPublicLinksService } from '../../services/campaign-public-links.service';
import { CampaignsService } from '../../services/campaigns.service';

// lowercase letters and numbers with optional dashes inbetween
const publicLinkRegExp = /^[a-z0-9](([a-z0-9]|\-)*[a-z0-9])?$/;

@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
})
export class CampaignFormComponent {
  campaignUsers: CampaignUserDto[] = [];

  campaignFormSubmitted = false;

  campaignForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    pubKey: new FormControl('', [Validators.required]),
    publicLink: new FormControl('', [
      Validators.required,
      Validators.pattern(publicLinkRegExp),
    ]),
  });

  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly campaignPublicLinksService: CampaignPublicLinksService,
    private readonly router: Router
  ) {}

  get name(): FormControl<string> {
    return this.campaignForm.controls.name;
  }
  get pubKey(): FormControl<string> {
    return this.campaignForm.controls.pubKey;
  }
  get publicLink(): FormControl<string> {
    return this.campaignForm.controls.publicLink;
  }

  async create(): Promise<void> {
    this.campaignFormSubmitted = true;
    this.campaignForm.markAllAsTouched();

    if (this.campaignForm.invalid) {
      return;
    }

    const dto: CampaignDto = {
      name: this.name.value,
      pubKey: this.pubKey.value,
      campaignUsers: this.campaignUsers,
    };

    const id = await this.campaignsService.create(dto);

    await this.createPublicLink(id);

    this.router.navigate([RouteNames.campaigns.index, id]);
  }

  async createPublicLink(campaignId: string): Promise<void> {
    const dto: CampaignPublicLinkDto = {
      campaignId: campaignId,
      link: this.publicLink.value,
    };

    this.campaignPublicLinksService.create(dto);
  }

  isInputInvalid(control: FormControl): boolean {
    return control.touched && control.invalid;
  }
}
