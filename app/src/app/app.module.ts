import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthModule } from './auth.module/auth.module';
import { AppComponent } from './components/app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpInterceptorProviders } from './http.interceptors';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    AuthModule,
    ReactiveFormsModule,
  ],
  providers: [HttpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
