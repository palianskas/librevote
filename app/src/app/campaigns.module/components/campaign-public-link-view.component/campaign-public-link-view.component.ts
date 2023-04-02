import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.module/services/auth.service';
import { User } from 'src/app/users.module/models/user.model';
import { VotingService } from 'src/app/votes.module/services/voting.service';
import { CampaignPublicLink } from '../../models/campaign-public-links/campaign-public-link.model';
import { CampaignPublicLinksService } from '../../services/campaign-public-links.service';

@Component({
  selector: 'app-campaign-public-link-view',
  templateUrl: './campaign-public-link-view.component.html',
  providers: [VotingService],
})
export class CampaignPublicLinkViewComponent implements OnInit, OnDestroy {
  campaignPublicLink: CampaignPublicLink;
  voucherId?: string;
  user?: User;

  isVotingAllowed: boolean;

  paramsSubscription: Subscription;
  queryParamsSubscription: Subscription;

  constructor(
    private readonly campaignPublicLinksService: CampaignPublicLinksService,
    private readonly votingService: VotingService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.paramsSubscription = this.route.params.subscribe(async (params) => {
      const publicLink = params['link'];

      this.campaignPublicLink = await this.fetchCampaignPublicLink(publicLink);

      this.checkIsVotingAllowed();
    });

    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (queryParams) => {
        this.voucherId = queryParams['voucherId'];

        this.checkIsVotingAllowed();
      }
    );

    this.user = await this.authService.getUser();

    this.checkIsVotingAllowed();
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
    this.queryParamsSubscription.unsubscribe();
  }

  private fetchCampaignPublicLink(
    publicLink: string
  ): Promise<CampaignPublicLink> {
    return this.campaignPublicLinksService.getByLink(publicLink);
  }

  private checkIsVotingAllowed() {
    this.isVotingAllowed = this.votingService.canCastVote(
      this.campaignPublicLink?.campaign,
      this.voucherId,
      this.user
    );
  }
}
