import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth.module/models/user.model';
import { AuthService } from 'src/app/auth.module/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  providers: [AuthService],
})
export class NavigationComponent implements OnInit {
  user: User = null;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.user;
  }

  async register() {
    const res = await this.authService.register(
      `test${Math.floor(Math.random() * 100)}@test.com`,
      'username',
      'pass'
    );
  }

  async login() {
    const res = await this.authService.login('test@test.com', 'pass');
  }

  async current() {
    const res = await this.authService.refetchCurrentUser();
  }

  async refresh() {
    const res = await this.authService.refreshAccess();
  }
}
