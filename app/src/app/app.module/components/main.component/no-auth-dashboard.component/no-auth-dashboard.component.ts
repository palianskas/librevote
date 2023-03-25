import { Component } from '@angular/core';
import { RouteNames } from 'src/app/app.module/app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-auth-dashboard',
  templateUrl: './no-auth-dashboard.component.html',
})
export class NoAuthDashboardComponent {
  publicLink?: string;

  constructor(private readonly router: Router) {}

  goToLink(): void {
    if (!this.publicLink) {
      return;
    }

    this.router.navigate([RouteNames.vote.index, this.publicLink]);
  }
}
