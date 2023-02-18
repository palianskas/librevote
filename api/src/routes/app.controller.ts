import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/services/auth/guards/guard-activators.decorator';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('status')
  async status(): Promise<StatusResponse> {
    return this.appService.status();
  }
}

export class StatusResponse {
  status: string;
}
