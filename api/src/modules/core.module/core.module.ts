import { Module } from '@nestjs/common';
import { StatusController } from 'src/modules/core.module/routes/status/status.controller';
import { StatusService } from './status/status.service';

@Module({
  controllers: [StatusController],
  providers: [StatusService],
})
export class CoreModule {}
