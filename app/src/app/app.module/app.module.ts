import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthModule } from '../auth.module/auth.module';
import { CampaignsModule } from '../campaigns.module/campaigns.module';
import { CommonModule } from '../common.module/common.module';
import { EncryptionModule } from '../encryption.module/encryption.module';
import { HttpInterceptorProviders } from '../http.interceptors';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component/app.component';
import { DashboardComponent } from './components/main.component/dashboard.component/dashboard.components';
import { MainComponent } from './components/main.component/main.component';
import { NoAuthDashboardComponent } from './components/main.component/no-auth-dashboard.component/no-auth-dashboard.component';
import { NavigationComponent } from './components/navigation.component/navigation.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    MainComponent,
    DashboardComponent,
    NoAuthDashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    CommonModule,
    AuthModule,
    CampaignsModule,
    EncryptionModule,
    FormsModule,
  ],
  providers: [HttpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
