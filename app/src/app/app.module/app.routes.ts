import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.module/services/auth.service';

export const RouteNames = {
  index: '',
  login: {
    index: 'login',
  },
  register: {
    index: 'register',
  },
  campaigns: {
    index: 'campaigns',
    form: {
      index: 'form',
    },
  },
  vote: {
    index: 'vote',
  },
} as const;

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const user = await this.authService.getUser();

    if (!!user) {
      return true;
    }

    this.router.navigate([RouteNames.index]);
    return false;
  }
}
