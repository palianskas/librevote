import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UserDto } from 'src/modules/users.module/models/user.dto';
import { UsersService } from 'src/modules/users.module/users.service';
import {
  UsersSearchRequest,
  UsersSearchResponse,
} from './models/users-search-contracts';

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

  @Post('search')
  async search(
    @Body() request: UsersSearchRequest,
  ): Promise<UsersSearchResponse> {
    const emails = request.emails;

    const users = await this.usersService.searchByEmails(emails);

    const dtos = users.map(UserDto.map);

    const response: UsersSearchResponse = {
      rows: dtos,
    };

    return response;
  }
}
