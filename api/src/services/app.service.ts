import { Injectable } from '@nestjs/common';
import { StatusResponse } from 'src/routes/app.controller';

@Injectable()
export class AppService {
  status(): StatusResponse {
    return {
      status: `Ok ${new Date().toISOString()}`,
    };
  }
}
