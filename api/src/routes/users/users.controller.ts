import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Request,
} from '@nestjs/common';
import { UserDto } from 'src/services/users/models/user.dto';
import { UsersService } from 'src/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async get(@Param('id') id: string): Promise<UserDto> {
    const user = await this.usersService.get(id);

    if (!user) {
      throw new NotFoundException();
    }

    const dto = UserDto.map(user);

    return dto;
  }
}
