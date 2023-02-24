import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, catchError, EMPTY } from 'rxjs';
import { ConfigService } from '../common.module/services/config.service';
import { AuthError } from '../auth.module/models/auth-error.enum';
import { AuthService } from '../auth.module/services/auth.service';

@Injectable({
  providedIn: 'root',
  deps: [ConfigService],
})
export class JwtAccessInterceptor implements HttpInterceptor {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem(
      this.configService.ACCESS_TOKEN_LOCAL_STORAGE_KEY
    );

    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error?.message === AuthError.AccessTokenExpired) {
          this.authService.refreshAccess();
        }

        return EMPTY;
      })
    );
  }
}
