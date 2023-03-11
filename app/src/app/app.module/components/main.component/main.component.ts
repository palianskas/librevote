import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/users.module/models/user.model';
import { AuthService } from 'src/app/auth.module/services/auth.service';
import { RouteNames } from '../../app.routes';

@Component({
  selector: 'main-root',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  user: User;
  routeNames = RouteNames;

  constructor(private readonly authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.user = await this.authService.getUser();

    this.authService.userObservable.subscribe((user) => {
      this.user = user;
    });
  }
}
