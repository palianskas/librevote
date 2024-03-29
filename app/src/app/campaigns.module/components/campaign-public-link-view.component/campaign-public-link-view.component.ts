import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.module/services/auth.service';
import { User } from 'src/app/users.module/models/user.model';
import { VotingService } from 'src/app/votes.module/services/voting.service';
import { CampaignPublicLink } from '../../models/campaign-public-links/campaign-public-link.model';
import { CampaignPublicLinksService } from '../../services/campaign-public-links.service';
import { VotesService } from 'src/app/votes.module/services/votes.service';
import { IPublicVotingStatusResponse } from 'src/app/votes.module/models/votes-contracts.model';
import { VotingVouchersService } from 'src/app/votes.module/services/vouchers.service';
import { VotingVoucher } from 'src/app/votes.module/models/voting-voucher.model';

@Component({
  selector: 'app-campaign-public-link-view',
  templateUrl: './campaign-public-link-view.component.html',
  providers: [VotingService],
})
export class CampaignPublicLinkViewComponent implements OnInit, OnDestroy {
  campaignPublicLink: CampaignPublicLink;
  voucherId?: string;
  voucher?: VotingVoucher;
  user?: User;

  isVotingAllowed = false;
  isCampaignAcceptingVotes = false;

  paramsSubscription: Subscription;
  queryParamsSubscription: Subscription;

  constructor(
    private readonly campaignPublicLinksService: CampaignPublicLinksService,
    private readonly votingService: VotingService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly votesService: VotesService,
    private readonly vouchersService: VotingVouchersService
  ) {}

  async ngOnInit(): Promise<void> {
    this.paramsSubscription = this.route.params.subscribe(async (params) => {
      const publicLink = params['link'];

      this.campaignPublicLink = await this.fetchCampaignPublicLink(publicLink);

      const campaignStatus = await this.fetchCampaignStatus(
        this.campaignPublicLink.campaignId
      );

      this.isCampaignAcceptingVotes = campaignStatus.isAcceptingVotes;

      this.checkIsVotingAllowed();
    });

    this.queryParamsSubscription = this.route.queryParams.subscribe(
      async (queryParams) => {
        this.voucherId = queryParams['voucherId'];

        if (!!this.voucherId) {
          this.voucher = await this.fetchVoucher(this.voucherId);
        }

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

  private fetchCampaignStatus(
    campaignId: string
  ): Promise<IPublicVotingStatusResponse> {
    return this.votesService.status(campaignId);
  }

  private fetchVoucher(voucherId: string): Promise<VotingVoucher> {
    return this.vouchersService.get(voucherId);
  }

  private checkIsVotingAllowed() {
    this.isVotingAllowed = this.votingService.canCastVote(
      this.campaignPublicLink?.campaign,
      this.voucher,
      this.user
    );
  }
}
