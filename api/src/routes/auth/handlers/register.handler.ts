import { BadRequestException, Injectable } from '@nestjs/common';
import { EncryptionService } from 'src/services/auth/encryption.service';
import { UserDto } from 'src/services/users/models/user.dto';
import { UsersService } from 'src/services/users/users.service';
import { IRegisterRequest } from '../models/auth-contracts.model';

@Injectable()
export class RegisterHandler {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly usersService: UsersService,
  ) {}

  async handle(request: IRegisterRequest): Promise<UserDto> {
    if (await this.isEmailAlreadyTaken(request.email)) {
      throw new BadRequestException();
    }

    const password = await this.encryptionService.encrypt(request.password);

    const data: UserDto = {
      email: request.email,
      name: request.name,
    };

    const entity = await this.usersService.create(data, password);

    const dto = UserDto.map(entity);

    return dto;
  }

  private async isEmailAlreadyTaken(email: string): Promise<boolean> {
    const user = await this.usersService.getByEmail(email);

    return !!user;
  }
}
