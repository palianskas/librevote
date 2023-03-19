import { PaillierEncryptionDomainBuilder } from './paillier-ecryption-domain/paillier-encryption-domain.builder';
import {
  PaillierEncryptionDomain,
  PaillierPrivKey,
  PaillierPubKey,
} from './paillier-ecryption-domain/paillier-encryption.domain';
import {
  PaillierDecryptor,
  PaillierEncryptor,
} from './paillier-ecryption-domain/paillier-encryptors';

export class EncryptionDomainFactory {
  static getPaillierEncryptionDomain(
    pubKey: PaillierPubKey,
    privKey: PaillierPrivKey
  ): PaillierEncryptionDomain {
    const builder = new PaillierEncryptionDomainBuilder();

    const domain = builder
      .withPubKey(pubKey)
      .withPrivKey(privKey)
      .withMod(pubKey.n)
      .withEncryptor(new PaillierEncryptor())
      .withDecryptor(new PaillierDecryptor())
      .build();

    return domain;
  }
}
