import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth.module/services/auth.service';
import { CampaignUserRole } from 'src/app/campaigns.module/models/campaign-user-role.enum';
import { CampaignUser } from 'src/app/campaigns.module/models/campaign-user.model';
import { UsersService } from 'src/app/users.module/services/users.service';

@Component({
  selector: 'app-campaign-form-users-input',
  templateUrl: './campaign-form-users-input.component.html',
})
export class CampaignFormUsersInputComponent implements OnInit {
  @Input() campaignUsers: CampaignUser[];

  availableRoles: CampaignUserRole[] = [
    CampaignUserRole.Admin,
    CampaignUserRole.Overseer,
    CampaignUserRole.Volunteer,
  ];

  isNewUserFormSubmitted = false;
  newUserForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.campaignUsers.length > 0) {
      return;
    }

    await this.initNewCampaignUsers();
  }

  get email(): FormControl<string> {
    return this.newUserForm.controls.email;
  }

  async searchCampaignUsers(): Promise<void> {
    this.isNewUserFormSubmitted = true;

    if (this.isInputInvalid(this.email)) {
      return;
    }

    const emails = [this.email.value];

    const users = await this.usersService.search(emails);

    if (users.length < 1) {
      this.newUserForm.setErrors({
        notFound: true,
      });

      return;
    }

    const user = users[0];

    this.campaignUsers.push({
      campaignId: '',
      userId: user.id,
      user: user,
      role: CampaignUserRole.Admin,
    });

    this.email.setValue(null);
    this.email.markAsUntouched();
    this.newUserForm.markAsPristine();
    this.isNewUserFormSubmitted = false;
  }

  removeCampaignUser(campaignUser: CampaignUser): void {
    const index = this.campaignUsers.indexOf(campaignUser);

    this.campaignUsers.splice(index, 1);
  }

  isInputInvalid(control: FormControl): boolean {
    return control.touched && control.invalid;
  }

  private async initNewCampaignUsers(): Promise<void> {
    const user = await this.authService.getUser();

    const campaignUser: CampaignUser = {
      campaignId: '',
      userId: user.id,
      user: user,
      role: CampaignUserRole.Admin,
    };

    this.campaignUsers.push(campaignUser);
  }
}
