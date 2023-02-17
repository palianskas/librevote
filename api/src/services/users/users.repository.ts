import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { DataAccessService } from 'src/services/data/data.service';
import { SaltHashResult } from '../auth/models/salt-hash.model';
import { UserDto } from './models/user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly dataService: DataAccessService) {}

  async get(id: string): Promise<User | null> {
    const filter = {
      id: id,
    };

    const user = await this.dataService.user.findFirst({ where: filter });

    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const filter = {
      email: email,
    };

    const user = await this.dataService.user.findFirst({ where: filter });

    return user;
  }

  async create(dto: UserDto, passwordHash: SaltHashResult): Promise<User> {
    const result = await this.dataService.user.create({
      data: {
        id: dto.id,
        email: dto.email,
        name: dto.name,
        password: passwordHash.hash,
      },
    });

    return result;
  }
}
