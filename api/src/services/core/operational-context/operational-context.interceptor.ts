import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { IAuthenticatedRequest } from 'src/routes/auth/models/auth-contracts.model';
import { OperationalContextService } from './operational-context.service';

@Injectable()
export class OperationalContextInterceptor implements NestInterceptor {
  constructor(
    private readonly operationalContextService: OperationalContextService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const user = context
      .switchToHttp()
      .getRequest<IAuthenticatedRequest>().user;

    this.operationalContextService.createContext(user);

    return next.handle();
  }
}
