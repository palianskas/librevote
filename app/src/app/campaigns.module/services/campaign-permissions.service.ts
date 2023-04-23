import { Injectable } from '@angular/core';
import { Campaign } from '../models/campaign.model';
import { AuthService } from 'src/app/auth.module/services/auth.service';
import { User } from 'src/app/users.module/models/user.model';
import { CampaignUserRole } from '../models/campaign-user-role.enum';

@Injectable({
  providedIn: 'root',
})
export class CampaignPermissionsService {
  private currentUser: User;

  constructor(private readonly authService: AuthService) {
    this.init();
  }

  private async init(): Promise<void> {
    this.currentUser = await this.authService.getUser();
  }

  public isAdmin(campaign: Campaign, user = this.currentUser): boolean {
    return campaign.campaignUsers.some(
      (cu) => cu.userId === user.id && cu.role === CampaignUserRole.Admin
    );
  }
}
