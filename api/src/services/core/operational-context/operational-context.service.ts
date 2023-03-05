import { Injectable, Scope } from '@nestjs/common';
import { User } from '@prisma/client';
import { IOperationalContext } from './operational-context.model';

@Injectable({ scope: Scope.REQUEST })
export class OperationalContextService {
  context: IOperationalContext;

  createContext(user: User) {
    this.context = {
      user: user,
    };
  }
}
