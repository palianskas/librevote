import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SaltHashResult } from './models/salt-hash.model';

@Injectable()
export class EncryptionService {
  async encrypt(value: string): Promise<SaltHashResult> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(value, salt);

    console.log(bcrypt.compareSync(value, hash), salt);

    const result: SaltHashResult = {
      salt: salt,
      hash: hash,
    };

    return result;
  }

  compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
