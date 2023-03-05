import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserDto } from 'src/modules/users.module/models/user.dto';
import { UsersService } from 'src/modules/users.module/users.service';

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
