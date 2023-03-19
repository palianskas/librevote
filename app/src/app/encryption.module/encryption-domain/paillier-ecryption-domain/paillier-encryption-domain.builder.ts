import { BigInteger } from 'big-integer';
import { IDecryptor, IEncryptor } from '../encryption.domain';
import {
  PaillierEncryptionDomain,
  PaillierPrivKey,
  PaillierPubKey,
} from './paillier-encryption.domain';

export class PaillierEncryptionDomainBuilder {
  private domain: PaillierEncryptionDomain;

  constructor() {
    this.domain = new PaillierEncryptionDomain();
  }

  withPrivKey(key: PaillierPrivKey): this {
    this.domain.setPrivKey(key);

    return this;
  }

  withPubKey(key: PaillierPubKey): this {
    this.domain.setPubKey(key);

    return this;
  }

  withMod(mod: BigInteger): this {
    this.domain.setMod(mod);

    return this;
  }

  withEncryptor(
    encryptor: IEncryptor<BigInteger, PaillierPrivKey, BigInteger>
  ): this {
    this.domain.setEncryptor(encryptor);

    return this;
  }

  withDecryptor(
    decryptor: IDecryptor<BigInteger, PaillierPubKey, BigInteger>
  ): this {
    this.domain.setDecryptor(decryptor);

    return this;
  }

  build(): PaillierEncryptionDomain {
    return this.domain;
  }
}
