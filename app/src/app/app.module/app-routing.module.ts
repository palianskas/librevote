import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth.module/components/login.component/login.component';
import { RegisterComponent } from '../auth.module/components/register.component/register.component';
import { CampaignFormComponent } from '../campaigns.module/components/campaign-form.component/campaign-form.component';
import { CampaignInfoComponent } from '../campaigns.module/components/campaign-info.component/campaign-info.component';
import { CampaignPublicLinkViewComponent } from '../campaigns.module/components/campaign-public-link-view.component/campaign-public-link-view.component';
import { CampaignsViewComponent } from '../campaigns.module/components/campaigns-view.component/campaigns-view.component';
import { AuthGuard, RouteNames } from './app.routes';
import { MainComponent } from './components/main.component/main.component';
import { CampaignResultsViewComponent } from '../campaigns.module/components/campaign-results-view.component/campaign-results-view.component';
import { PublicLinkSearchComponent } from './components/main.component/public-link-search.component/public-link-search.component';

const routes: Routes = [
  {
    path: RouteNames.index,
    component: MainComponent,
  },
  { path: RouteNames.login.index, component: LoginComponent },
  { path: RouteNames.register.index, component: RegisterComponent },
  {
    path: RouteNames.campaigns.index,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: CampaignsViewComponent },
      {
        path: RouteNames.campaigns.form.index,
        children: [
          {
            path: '',
            component: CampaignFormComponent,
          },
          {
            path: ':id',
            component: CampaignFormComponent,
          },
        ],
      },
      {
        path: ':id',
        component: CampaignInfoComponent,
      },
      {
        path: 'results',
        children: [
          {
            path: ':id',
            component: CampaignResultsViewComponent,
          },
        ],
      },
    ],
  },
  {
    path: RouteNames.vote.index,
    children: [
      {
        path: RouteNames.vote.search.index,
        component: PublicLinkSearchComponent,
      },
      {
        path: ':link',
        component: CampaignPublicLinkViewComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
