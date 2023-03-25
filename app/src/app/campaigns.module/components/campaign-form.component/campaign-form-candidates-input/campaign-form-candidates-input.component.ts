import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.module/services/auth.service';
import { CampaignCandidate } from 'src/app/campaigns.module/models/campaign-candidates/campaign-candidate.model';
import { Campaign } from 'src/app/campaigns.module/models/campaign.model';
import { UsersService } from 'src/app/users.module/services/users.service';

@Component({
  selector: 'app-campaign-form-candidates-input',
  templateUrl: './campaign-form-candidates-input.component.html',
})
export class CampaignFormCandidatesInputComponent {
  @Input() campaign: Campaign;
  @Input() candidates: CampaignCandidate[];

  isformSubmitted = false;
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  get name(): FormControl<string> {
    return this.form.controls.name;
  }

  get description(): FormControl<string> {
    return this.form.controls.description;
  }

  addNew(): void {
    const isValid = this.handleFormSubmit();

    if (!isValid) {
      return;
    }

    const candidate = CampaignCandidate.map({
      name: this.name.value,
      description: this.description.value,
      index: this.candidates.length,
      campaignId: this.campaign.id,
    });

    this.candidates.push(candidate);

    this.resetForm();
  }

  removeCandidate(candidate: CampaignCandidate): void {
    const index = this.candidates.indexOf(candidate);

    this.candidates.splice(index, 1);
  }

  isInputInvalid(control: FormControl): boolean {
    return control.touched && control.invalid;
  }

  private handleFormSubmit(): boolean {
    this.isformSubmitted = true;
    this.form.markAllAsTouched();

    return !this.form.invalid;
  }

  private resetForm(): void {
    this.form.setValue({
      name: '',
      description: '',
    });

    this.form.markAsUntouched();
    this.form.markAsPristine();
    this.isformSubmitted = false;
  }
}
