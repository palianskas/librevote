import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth.module/models/user.model';
import { AuthService } from 'src/app/auth.module/services/auth.service';
import { RouteNames } from '../../app.routes';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  user: User = null;
  routeNames = RouteNames;

  constructor(private readonly authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.user = await this.authService.getUser();

    this.authService.userObservable.subscribe((user) => {
      this.user = user;
    });
  }
}
