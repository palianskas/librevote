import { BigInteger } from 'big-integer';
import { AesEncryptionDomainBuilder } from './aes-encryption-domain/aes-encryption-domain.builder';
import { AesEncryptionDomain } from './aes-encryption-domain/aes-encryption.domain';
import { PaillierEncryptionDomainBuilder } from './paillier-encryption-domain/paillier-encryption-domain.builder';
import { PaillierEncryptionDomain } from './paillier-encryption-domain/paillier-encryption.domain';

export class EncryptionDomainFactory {
  static getPaillierEncryptionDomain(
    pubKey: BigInteger,
    privKey: BigInteger
  ): PaillierEncryptionDomain {
    const builder = new PaillierEncryptionDomainBuilder();

    const domain = builder
      .withPubKey(pubKey)
      .withPrivKey(privKey)
      .withMod(pubKey)
      .build();

    return domain;
  }

  static getAesEncryptionDomain(password: string): AesEncryptionDomain {
    const builder = new AesEncryptionDomainBuilder();

    const domain = builder.withPrivKey(password).build();

    return domain;
  }
}
