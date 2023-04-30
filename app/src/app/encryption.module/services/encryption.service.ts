import { Injectable } from '@angular/core';
import { random, pkcs5 } from 'node-forge';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  saltPassword(
    password: string,
    salt?: string
  ): {
    saltedPassword: string;
    salt: string;
  } {
    salt ??= random.getBytesSync(256);
    const saltedPassword = pkcs5.pbkdf2(password, salt, 4, 32);

    return { saltedPassword, salt };
  }

  isMatch(
    password: string,
    saltedPasswordOther: string,
    salt: string
  ): boolean {
    const { saltedPassword } = this.saltPassword(password, salt);

    return saltedPassword === saltedPasswordOther;
  }
}
