import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouteNames } from 'src/app/app.module/app.routes';
import { AuthService } from 'src/app/auth.module/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formSubmitted = false;
  isLoginInvalid = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  get email(): FormControl<string> {
    return this.loginForm.controls.email;
  }
  get password(): FormControl<string> {
    return this.loginForm.controls.password;
  }

  async login() {
    this.formSubmitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    try {
      await this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
    } catch (e) {
      this.isLoginInvalid = true;

      return;
    }

    this.router.navigate([RouteNames.index]);
  }

  isInputInvalid(control: FormControl): boolean {
    return (this.formSubmitted || control.touched) && control.invalid;
  }
}
