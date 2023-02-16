import { User } from '@prisma/client';

export interface ICurrentUserRequest {
  user: User;
}
