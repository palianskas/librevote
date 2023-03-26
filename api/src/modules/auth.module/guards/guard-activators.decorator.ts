import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const IS_CREDENTIALS_KEY = 'isCredentials';
export const IS_OPTIONAL_JWT = 'isOptionalJwt';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const WithCredentials = () => SetMetadata(IS_CREDENTIALS_KEY, true);
export const OptionalJwt = () => SetMetadata(IS_OPTIONAL_JWT, true);
