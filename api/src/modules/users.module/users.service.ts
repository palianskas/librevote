import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserDto } from './models/user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async get(id: string): Promise<User | null> {
    const user = this.usersRepository.get(id);

    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = this.usersRepository.getByEmail(email);

    return user;
  }

  async create(dto: UserDto, password: string): Promise<User> {
    return this.usersRepository.create(dto, password);
  }

  async searchByEmails(emails: string[]): Promise<User[]> {
    const users = await Promise.all(
      emails.map((email) => this.getByEmail(email)),
    );

    return users.filter((user) => !!user) as User[];
  }
}
