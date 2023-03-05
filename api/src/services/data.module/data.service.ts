import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DataAccessService extends PrismaClient {
  // see https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
