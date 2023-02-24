import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth.module/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private readonly authService: AuthService) {}

  registerForm = new FormGroup({
    name: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
  });

  register() {
    this.authService.register(
      this.registerForm.value.email,
      this.registerForm.value.name,
      this.registerForm.value.password
    );
  }
}
