import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthModule } from '../auth.module/auth.module';
import { CampaignsModule } from '../campaigns.module/campaigns.module';
import { CommonModule } from '../common.module/common.module';
import { HttpInterceptorProviders } from '../http.interceptors';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component/app.component';
import { MainComponent } from './components/main.component/main.component';
import { NavigationComponent } from './components/navigation.component/navigation.component';

@NgModule({
  declarations: [AppComponent, NavigationComponent, MainComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    CommonModule,
    AuthModule,
    CampaignsModule,
  ],
  providers: [HttpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
