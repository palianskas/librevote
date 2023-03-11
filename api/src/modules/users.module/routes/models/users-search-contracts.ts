import { UserDto } from '../../models/user.dto';

export class UsersSearchRequest {
  emails: string[];
}

export class UsersSearchResponse {
  rows: UserDto[];
}
