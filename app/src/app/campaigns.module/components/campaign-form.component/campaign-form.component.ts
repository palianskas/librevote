import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { CampaignSettingsDto } from '../../models/campaign-settings/campaign-settings.model';
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

function toDateString(date: Date): string {
  return formatDate(date, 'yyyy-MM-ddTHH:mm', 'en');
}

@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
})
export class CampaignFormComponent implements OnInit, OnDestroy {
  campaign: Campaign;

  campaignFormSubmitted = false;
  campaignForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    publicLink: new FormControl('', [
      Validators.required,
      Validators.pattern(publicLinkRegExp),
    ]),
  });

  paramsSubscription: Subscription;

  isFormSubmitError = false;

  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly campaignPublicLinksService: CampaignPublicLinksService,
    private readonly campaignCandidatesService: CampaignCandidatesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.paramsSubscription = this.route.params.subscribe(async (params) => {
      const id = params['id'];

      await this.initCampaign(id);
      this.initForm();

      // add validators when controls are done initializing
      this.startDate.addValidators(
        dateIntervalValidator(this.startDate, this.endDate)
      );
      this.endDate.addValidators(
        dateIntervalValidator(this.startDate, this.endDate)
      );
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  get name(): FormControl<string> {
    return this.campaignForm.controls.name;
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

  get isSaveDisabled(): boolean {
    return (
      this.campaign.campaignUsers.length < 1 ||
      this.campaign.candidates.length < 1
    );
  }

  isInputInvalid(control: FormControl): boolean {
    return control.touched && control.invalid;
  }

  async save(): Promise<void> {
    if (!this.handleFormSubmit()) {
      return;
    }

    this.flushFormDataToRecord();

    try {
      const id = await this.handleSave();

      this.isFormSubmitError = false;

      this.router.navigate([RouteNames.campaigns.index, id]);
    } catch {
      this.isFormSubmitError = true;
    }
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

  onSettingsChange(): void {
    if (this.campaign.settings.isManualVoteStartEndEnabled) {
      this.startDate.disable();
      this.endDate.disable();

      this.startDate.setValue('');
      this.endDate.setValue('');
    } else {
      if (!this.campaign.startDate || !this.campaign.endDate) {
        this.initCampaignStartEndDates();
      }

      this.startDate.enable();
      this.endDate.enable();

      this.startDate.setValue(toDateString(this.campaign.startDate));
      this.endDate.setValue(toDateString(this.campaign.endDate));
    }
  }

  private async initCampaign(id?: string): Promise<void> {
    if (!!id) {
      this.campaign = await this.campaignsService.get(id);

      return;
    }

    this.campaign = Campaign.map({
      name: '',
      campaignUsers: [],
      publicLink: null,
      candidates: [],
      settings: CampaignSettingsDto.default,
    });

    this.initCampaignStartEndDates();
  }

  private initCampaignStartEndDates(): void {
    const startDate = new Date();
    const endDate = new Date();

    startDate.setUTCHours(startDate.getUTCHours() + 1);
    endDate.setUTCHours(endDate.getUTCHours() + 1);

    endDate.setUTCDate(endDate.getUTCDate() + 1);

    this.campaign.startDate = startDate;
    this.campaign.endDate = endDate;
  }

  private initForm(): void {
    this.campaignForm.setValue({
      name: this.campaign.name,
      startDate: '',
      endDate: '',
      publicLink: this.campaign.publicLink?.link ?? '',
    });

    if (this.campaign.settings.isManualVoteStartEndEnabled) {
      this.startDate.disable();
      this.endDate.disable();
    } else {
      this.startDate.setValue(toDateString(this.campaign.startDate));
      this.endDate.setValue(toDateString(this.campaign.endDate));
    }
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
    if (!!this.campaign.id) {
      const response = await this.updateRecord(this.campaign);

      return response.id;
    }

    const id = this.createRecord(this.campaign);

    return id;
  }

  private async createRecord(campaign: Campaign): Promise<string> {
    const id = await this.campaignsService.create(campaign);

    this.createPublicLink(id);
    this.createCandidates(id);

    return id;
  }
  private updateRecord(dto: CampaignDto): Promise<CampaignDto> {
    this.updatePublicLink();

    return this.campaignsService.update(this.campaign);
  }

  private flushFormDataToRecord(): void {
    this.campaign.name = this.name.value;

    if (this.campaign.settings.isManualVoteStartEndEnabled) {
      this.campaign.startDate = null;
      this.campaign.endDate = null;
    } else {
      this.campaign.startDate = new Date(this.startDate.value);
      this.campaign.endDate = new Date(this.endDate.value);
    }
  }
}
