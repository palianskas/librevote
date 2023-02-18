import { User } from '@prisma/client';

export class UserDto {
  id?: string;
  name: string;
  email: string;

  static map(entity: User): UserDto {
    const dto = new UserDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.email = entity.email;

    return dto;
  }
}
