import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/users.module/models/user.model';
import { AuthService } from 'src/app/auth.module/services/auth.service';
import { RouteNames } from '../../app.routes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  user: User = null;
  routeNames = RouteNames;

  userSubscription: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = await this.authService.getUser();

    this.userSubscription = this.authService.userObservable.subscribe(
      (user) => {
        this.user = user;
      }
    );
  }

  logOut(): void {
    this.authService.logout();

    //reload
    this.router.navigate(['.']);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
