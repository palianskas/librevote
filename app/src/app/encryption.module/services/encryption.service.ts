import { Injectable } from '@angular/core';
import { BigInteger } from 'big-integer';
import { random, pkcs5 } from 'node-forge';
import { PaillierEncryptor } from '../encryption-domain/paillier-encryption-domain/paillier-encryptors';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  static saltPassword(
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

  static isMatch(
    password: string,
    saltedPasswordOther: string,
    salt: string
  ): boolean {
    const { saltedPassword, ..._ } = EncryptionService.saltPassword(
      password,
      salt
    );

    return saltedPassword === saltedPasswordOther;
  }

  paillierEncrypt(message: BigInteger, pubKey: BigInteger): BigInteger {
    const encryptor = new PaillierEncryptor();

    const cipher = encryptor.encrypt(message, pubKey);

    return cipher;
  }
}
