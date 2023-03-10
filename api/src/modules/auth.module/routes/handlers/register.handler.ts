import { BadRequestException, Injectable } from '@nestjs/common';
import { EncryptionService } from 'src/modules/auth.module/encryption.service';
import { UserDto } from 'src/modules/users.module/models/user.dto';
import { UsersService } from 'src/modules/users.module/users.service';
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
