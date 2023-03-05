import { Module } from '@nestjs/common';
import { StatusController } from 'src/modules/core.module/routes/status/status.controller';
import { OperationalContextService } from './operational-context/operational-context.service';
import { StatusService } from './status/status.service';

@Module({
  controllers: [StatusController],
  providers: [StatusService, OperationalContextService],
  exports: [OperationalContextService],
})
export class CoreModule {}
