import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtAccessInterceptor } from './jwt-access.interceptor';

/** Http interceptor providers in outside-in order */
export const HttpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtAccessInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: JwtAccessInterceptor, multi: true },
];
