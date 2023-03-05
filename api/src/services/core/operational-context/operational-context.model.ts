import { User } from '@prisma/client';

export interface IOperationalContext {
  user: User;
}
