import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouteNames } from 'src/app/app.module/app.routes';
import { AuthService } from 'src/app/auth.module/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  formSubmitted = false;
  isRegistrationInvalid = false;

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  get name(): FormControl<string> {
    return this.registerForm.controls.name;
  }
  get email(): FormControl<string> {
    return this.registerForm.controls.email;
  }
  get password(): FormControl<string> {
    return this.registerForm.controls.password;
  }

  async register() {
    this.formSubmitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    try {
      await this.authService.register(
        this.registerForm.value.email,
        this.registerForm.value.name,
        this.registerForm.value.password
      );
    } catch (e) {
      this.isRegistrationInvalid = true;

      return;
    }

    this.router.navigate([RouteNames.index]);
  }

  isInputInvalid(control: FormControl): boolean {
    return (this.formSubmitted || control.touched) && control.invalid;
  }
}
