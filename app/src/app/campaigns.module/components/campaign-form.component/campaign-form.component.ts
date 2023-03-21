import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouteNames } from 'src/app/app.module/app.routes';
import { CampaignPublicLinkDto } from '../../models/campaign-public-links/campaign-public-link.model';
import { Campaign, CampaignDto } from '../../models/campaign.model';
import { CampaignCandidatesService } from '../../services/campaign-candidates.service';
import { CampaignPublicLinksService } from '../../services/campaign-public-links.service';
import { CampaignsService } from '../../services/campaigns.service';

// lowercase letters and numbers with optional dashes inbetween
const publicLinkRegExp = /^[a-z0-9](([a-z0-9]|\-)*[a-z0-9])?$/;

function dateIntervalValidator(
  startDateControl: AbstractControl,
  endDateControl: AbstractControl
): ValidatorFn {
  return (): ValidationErrors | null => {
    const startDate = new Date(startDateControl.value);
    const endDate = new Date(endDateControl.value);

    const isOverlap = startDate >= endDate;

    return isOverlap ? { overlap: true } : null;
  };
}

@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
})
export class CampaignFormComponent implements OnInit {
  campaign: Campaign;

  campaignFormSubmitted = false;
  campaignForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    pubKey: new FormControl('', [Validators.required]),
    startDate: new FormControl(
      formatDate(new Date(), 'yyyy-MM-ddTHH:mm', 'en'),
      [Validators.required]
    ),
    endDate: new FormControl(formatDate(new Date(), 'yyyy-MM-ddTHH:mm', 'en'), [
      Validators.required,
    ]),
    publicLink: new FormControl('', [
      Validators.required,
      Validators.pattern(publicLinkRegExp),
    ]),
  });

  paramsSubscription: Subscription;

  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly campaignPublicLinksService: CampaignPublicLinksService,
    private readonly campaignCandidatesService: CampaignCandidatesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    // add validators when controls are done initializing
    this.startDate.addValidators(
      dateIntervalValidator(this.startDate, this.endDate)
    );
    this.endDate.addValidators(
      dateIntervalValidator(this.startDate, this.endDate)
    );
  }

  async ngOnInit(): Promise<void> {
    this.paramsSubscription = this.route.params.subscribe(async (params) => {
      const id = params['id'];

      await this.initCampaign(id);
      this.initForm();
    });
  }

  get name(): FormControl<string> {
    return this.campaignForm.controls.name;
  }
  get pubKey(): FormControl<string> {
    return this.campaignForm.controls.pubKey;
  }
  get publicLink(): FormControl<string> {
    return this.campaignForm.controls.publicLink;
  }
  get startDate(): FormControl<string> {
    return this.campaignForm.controls.startDate;
  }
  get endDate(): FormControl<string> {
    return this.campaignForm.controls.endDate;
  }

  isInputInvalid(control: FormControl): boolean {
    return control.touched && control.invalid;
  }

  async save(): Promise<void> {
    if (!this.handleFormSubmit()) {
      return;
    }

    this.flushFormDataToRecord();

    const id = await this.handleSave();

    this.router.navigate([RouteNames.campaigns.index, id]);
  }

  async onPublicLinkSubmit(): Promise<void> {
    if (this.isInputInvalid(this.publicLink)) {
      return;
    }

    const existingPublicLink = await this.campaignPublicLinksService.getByLink(
      this.publicLink.value
    );

    if (
      !!existingPublicLink &&
      existingPublicLink.campaignId != this.campaign.id
    ) {
      this.publicLink.setErrors({
        taken: true,
      });
    }
  }

  private async initCampaign(id?: string): Promise<void> {
    if (!!id) {
      this.campaign = await this.campaignsService.get(id);

      return;
    }

    const startDate = new Date();
    const endDate = new Date();

    endDate.setUTCDate(endDate.getUTCDate() + 1);

    this.campaign = Campaign.map({
      name: '',
      pubKey: '',
      startDate: startDate,
      endDate: endDate,
      campaignUsers: [],
      publicLink: null,
      candidates: [],
    });
  }

  private initForm(): void {
    this.campaignForm.setValue({
      name: this.campaign.name,
      pubKey: this.campaign.pubKey,
      startDate: formatDate(this.campaign.startDate, 'yyyy-MM-ddTHH:mm', 'en'),
      endDate: formatDate(this.campaign.endDate, 'yyyy-MM-ddTHH:mm', 'en'),
      publicLink: this.campaign.publicLink?.link ?? '',
    });
  }

  private async createPublicLink(campaignId: string): Promise<void> {
    const dto: CampaignPublicLinkDto = {
      campaignId: campaignId,
      link: this.publicLink.value,
    };

    this.campaignPublicLinksService.create(dto);
  }

  private async updatePublicLink(): Promise<void> {
    const dto: CampaignPublicLinkDto = {
      id: this.campaign.publicLink.id,
      campaignId: this.campaign.id,
      link: this.publicLink.value,
    };

    this.campaignPublicLinksService.update(dto);
  }

  private async createCandidates(campaignId: string): Promise<void> {
    this.campaign.candidates.forEach((candidate) => {
      (candidate.campaignId = campaignId),
        this.campaignCandidatesService.create(candidate);
    });
  }

  private handleFormSubmit(): boolean {
    this.campaignFormSubmitted = true;
    this.campaignForm.markAllAsTouched();

    return !this.campaignForm.invalid;
  }

  private async handleSave(): Promise<string> {
    const dto = CampaignDto.map(this.campaign);

    if (!!dto.id) {
      const response = await this.updateRecord(dto);

      return response.id;
    }

    const id = this.createRecord(dto);

    return id;
  }

  private async createRecord(dto: CampaignDto): Promise<string> {
    const id = await this.campaignsService.create(dto);

    this.createPublicLink(id);
    this.createCandidates(id);

    return id;
  }
  private updateRecord(dto: CampaignDto): Promise<CampaignDto> {
    this.updatePublicLink();

    return this.campaignsService.update(dto);
  }

  private flushFormDataToRecord(): void {
    this.campaign.name = this.name.value;
    this.campaign.pubKey = this.pubKey.value;
    this.campaign.startDate = new Date(this.startDate.value);
    this.campaign.endDate = new Date(this.endDate.value);
  }
}
