import { NgModule } from '@angular/core';
import { CommonModule } from '../common.module/common.module';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [AuthService],
})
export class AuthModule {}
