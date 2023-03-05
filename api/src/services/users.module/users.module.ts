import { Module } from '@nestjs/common';
import { UsersController } from 'src/routes/users/users.controller';
import { DataModule } from '../data.module/data.module';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [DataModule],
  exports: [UsersService],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
