import { Injectable } from '@nestjs/common';
import { StatusResponse } from 'src/services/core.module/routes/status/status.controller';

@Injectable()
export class StatusService {
  status(): StatusResponse {
    return {
      status: `Ok ${new Date().toISOString()}`,
    };
  }
}
