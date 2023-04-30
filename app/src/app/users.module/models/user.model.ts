export class User {
  id: string;
  name: string;
  email: string;

  toDto(): UserDto {
    const dto = new UserDto();

    dto.id = this.id;
    dto.name = this.name;
    dto.email = this.email;

    return dto;
  }

  static map(dto: UserDto): User {
    const entity = new User();

    entity.id = dto.id;
    entity.name = dto.name;
    entity.email = dto.email;

    return entity;
  }
}

export class UserDto {
  id?: string;
  name: string;
  email: string;

  static map(data: Partial<UserDto>): UserDto {
    const dto = new UserDto();

    dto.id = data.id;
    dto.name = data.name;
    dto.email = data.email;

    return dto;
  }
}
