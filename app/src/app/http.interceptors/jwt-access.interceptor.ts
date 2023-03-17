import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, catchError, from, switchMap } from 'rxjs';
import { ConfigService } from '../common.module/services/config.service';
import { AuthError } from '../auth.module/models/auth-error.enum';
import { JwtService } from '../auth.module/services/jwt.service';

@Injectable({
  providedIn: 'root',
  deps: [ConfigService],
})
export class JwtAccessInterceptor implements HttpInterceptor {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = this.withAuthHeaders(this.withContentHeaders(req));

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.message === AuthError.AccessTokenExpired) {
          return from(this.jwtService.refreshAccess()).pipe(
            switchMap(() => {
              req = this.withAuthHeaders(req);

              return next.handle(req);
            })
          );
        }

        throw error;
      })
    );
  }

  private withContentHeaders<T>(request: HttpRequest<T>): HttpRequest<T> {
    const authenticatedRequest = request.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
      },
    });

    return authenticatedRequest;
  }

  private withAuthHeaders<T>(request: HttpRequest<T>): HttpRequest<T> {
    const accessToken = localStorage.getItem(
      this.configService.ACCESS_TOKEN_LOCAL_STORAGE_KEY
    );

    const authenticatedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return authenticatedRequest;
  }
}
