import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth.module/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private readonly authService: AuthService) {}

  loginForm = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });

  login() {
    this.authService.login(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
  }
}
