import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
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
}
