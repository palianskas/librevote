import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth.module/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService],
})
export class AppComponent {
  constructor(private readonly authService: AuthService) {}

  title = 'app';
}
