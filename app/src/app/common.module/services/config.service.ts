import { Injectable } from '@angular/core';
import { environment } from 'environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  API_URL = environment.API_URL;

  REFRESH_TOKEN_LOCAL_STORAGE_KEY = 'REFRESH_TOKEN';
  ACCESS_TOKEN_LOCAL_STORAGE_KEY = 'ACCESS_TOKEN';
  AUTHORIZATION_HEADER_KEY = 'Authorization';

  USER_LOCAL_STORAGE_KEY = 'USER';
}
