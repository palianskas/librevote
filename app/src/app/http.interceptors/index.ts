import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtAccessInterceptor } from './jwt-access.interceptor';

export const HttpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtAccessInterceptor, multi: true },
];
