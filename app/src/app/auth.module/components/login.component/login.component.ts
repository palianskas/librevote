import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RouteNames } from 'src/app/app.module/app.routes';
import { AuthService } from 'src/app/auth.module/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  loginForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });

  async login() {
    await this.authService.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
    this.router.navigate([RouteNames.index]);
  }
}
