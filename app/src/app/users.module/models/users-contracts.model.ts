import { UserDto } from 'src/app/users.module/models/user.model';

export interface IUsersSearchRequest {
  emails: string[];
}

export interface IUsersSearchResponse {
  rows: UserDto[];
}
