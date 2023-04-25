import { IEncryptionDomainBuilder } from '../encryption-domain.builder';
import { AesEncryptionDomain } from './aes-encryption.domain';
import { AesDecryptor, AesEncryptor } from './aes-encryptors';

export class AesEncryptionDomainBuilder
  implements IEncryptionDomainBuilder<string>
{
  private domain: AesEncryptionDomain;

  constructor() {
    this.domain = new AesEncryptionDomain();

    this.domain.setMod('');
    this.domain.setEncryptor(new AesEncryptor());
    this.domain.setDecryptor(new AesDecryptor());
  }

  withPrivKey(key: string): this {
    this.domain.setPrivKey(key);
    this.domain.setPubKey(key);

    return this;
  }

  withPubKey(key: string): this {
    // ignore
    return this;
  }

  withMod(mod: string): this {
    // ignore
    return this;
  }

  withEncryptor(): this {
    // ignore
    return this;
  }
  withDecryptor(): this {
    // ignore
    return this;
  }

  build(): AesEncryptionDomain {
    return this.domain;
  }
}
