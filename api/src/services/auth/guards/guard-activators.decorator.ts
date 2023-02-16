import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const IS_CREDENTIALS_KEY = 'isCredentials';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const WithCredentials = () => SetMetadata(IS_CREDENTIALS_KEY, true);
