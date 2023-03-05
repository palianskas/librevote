import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/services/auth.module/guards/guard-activators.decorator';
import { StatusService } from 'src/services/core.module/status/status.service';

@Controller()
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Public()
  @Get('status')
  async status(): Promise<StatusResponse> {
    return this.statusService.status();
  }
}

export class StatusResponse {
  status: string;
}
