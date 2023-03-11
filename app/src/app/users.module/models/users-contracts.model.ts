import { UserDto } from 'src/app/users.module/models/user.model';

export class UsersSearchRequest {
  emails: string[];
}

export class UsersSearchResponse {
  rows: UserDto[];
}
