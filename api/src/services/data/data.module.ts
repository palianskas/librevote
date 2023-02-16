import { Module } from '@nestjs/common';
import { DataAccessService } from './data.service';

@Module({
  providers: [DataAccessService],
  exports: [DataAccessService],
})
export class DataModule {}
