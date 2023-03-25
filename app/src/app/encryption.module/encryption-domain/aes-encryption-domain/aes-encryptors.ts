import { IDecryptor, IEncryptor } from '../encryption.domain';
import { cipher, util } from 'node-forge';

function normalizeKey(key: string): string {
  while (key.length < 32) {
    key += key;
  }

  return key.slice(0, 32);
}

export class AesEncryptor implements IEncryptor<string> {
  encrypt(message: string, key: string): string {
    key = normalizeKey(key);

    const encryptor = cipher.createCipher('AES-CBC', key);

    encryptor.start({ iv: key });
    encryptor.update(util.createBuffer(message));
    encryptor.finish();

    const result = encryptor.output;

    return result.data;
  }
}

export class AesDecryptor implements IDecryptor<string> {
  decrypt(message: string, key: string): string | null {
    key = normalizeKey(key);

    const encryptor = cipher.createDecipher('AES-CBC', key);

    encryptor.start({ iv: key });
    encryptor.update(util.createBuffer(message));
    if (!encryptor.finish()) {
      return null;
    }

    const result = encryptor.output;

    return result.data;
  }
}
