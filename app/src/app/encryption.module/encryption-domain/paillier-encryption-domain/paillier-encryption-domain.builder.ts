import { BigInteger } from 'big-integer';
import { IEncryptionDomainBuilder } from '../encryption-domain.builder';
import { PaillierEncryptionDomain } from './paillier-encryption.domain';
import { PaillierDecryptor, PaillierEncryptor } from './paillier-encryptors';

export class PaillierEncryptionDomainBuilder
  implements IEncryptionDomainBuilder<BigInteger>
{
  private domain: PaillierEncryptionDomain;

  constructor() {
    this.domain = new PaillierEncryptionDomain();

    this.domain.setEncryptor(new PaillierEncryptor());
    this.domain.setDecryptor(new PaillierDecryptor());
  }

  withPrivKey(key: BigInteger): this {
    this.domain.setPrivKey(key);

    return this;
  }

  withPubKey(key: BigInteger): this {
    this.domain.setPubKey(key);

    return this;
  }

  withMod(mod: BigInteger): this {
    this.domain.setMod(mod);

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

  build(): PaillierEncryptionDomain {
    return this.domain;
  }
}
