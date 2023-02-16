import { User } from '@prisma/client';

export interface ILoginRequest {
  user: User;
}
