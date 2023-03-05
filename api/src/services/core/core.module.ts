import { Module } from '@nestjs/common';
import { StatusController } from 'src/routes/status/status.controller';
import { StatusController } from '../../routes/status/status.controller';
import { StatusService } from './status/status.service';

@Module({
  controllers: [StatusController],
  providers: [
    StatusService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class CoreModule {}
