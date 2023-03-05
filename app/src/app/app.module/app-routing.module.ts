import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth.module/components/login.component/login.component';
import { RegisterComponent } from '../auth.module/components/register.component/register.component';
import { CampaignInfoComponent } from '../campaigns.module/components/campaign-info.component/campaign-info.component';
import { CampaignsViewComponent } from '../campaigns.module/components/campaigns-view.component/campaigns-view.component';
import { RouteNames } from './app.routes';

const routes: Routes = [
  {
    path: RouteNames.index,
    redirectTo: RouteNames.campaigns.index,
    pathMatch: 'full',
  },
  { path: RouteNames.login.index, component: LoginComponent },
  { path: RouteNames.register.index, component: RegisterComponent },
  {
    path: RouteNames.campaigns.index,
    children: [
      { path: '', component: CampaignsViewComponent },
      {
        path: ':id',
        component: CampaignInfoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
