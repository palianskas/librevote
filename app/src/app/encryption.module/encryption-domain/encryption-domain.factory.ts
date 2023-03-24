import { BigInteger } from 'big-integer';
import { EncryptionDomain } from './encryption.domain';
import { PaillierEncryptionDomainBuilder } from './paillier-ecryption-domain/paillier-encryption-domain.builder';

export class EncryptionDomainFactory {
  static getPaillierEncryptionDomain(
    pubKey: BigInteger,
    privKey: BigInteger
  ): EncryptionDomain {
    const builder = new PaillierEncryptionDomainBuilder();

    const domain = builder
      .withPubKey(pubKey)
      .withPrivKey(privKey)
      .withMod(pubKey)
      .build();

    return domain;
  }
}
