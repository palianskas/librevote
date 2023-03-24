import { random, pkcs5 } from 'node-forge';

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
}
