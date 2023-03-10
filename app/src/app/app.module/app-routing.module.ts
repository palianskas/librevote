import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../auth.module/components/login.component/login.component';
import { RegisterComponent } from '../auth.module/components/register.component/register.component';
import { CampaignFormComponent } from '../campaigns.module/components/campaign-form.component/campaign-form.component';
import { CampaignInfoComponent } from '../campaigns.module/components/campaign-info.component/campaign-info.component';
import { CampaignsViewComponent } from '../campaigns.module/components/campaigns-view.component/campaigns-view.component';
import { AuthGuard, RouteNames } from './app.routes';
import { MainComponent } from './components/main.component/main.component';

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
