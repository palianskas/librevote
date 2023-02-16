import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DataAccessService } from 'src/services/data/data.service';

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
}
