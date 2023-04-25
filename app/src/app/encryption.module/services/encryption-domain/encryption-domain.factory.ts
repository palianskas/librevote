import { Injectable } from '@angular/core';
import { BigInteger } from 'big-integer';
import { AesEncryptionDomainBuilder } from './aes-encryption-domain/aes-encryption-domain.builder';
import { AesEncryptionDomain } from './aes-encryption-domain/aes-encryption.domain';
import { PaillierEncryptionDomainBuilder } from './paillier-encryption-domain/paillier-encryption-domain.builder';
import { PaillierEncryptionDomain } from './paillier-encryption-domain/paillier-encryption.domain';
import { RngService } from '../rng.service';

@Injectable({ providedIn: 'root' })
export class EncryptionDomainFactory {
  constructor(private readonly rngService: RngService) {}

  getPaillierEncryptionDomain(
    pubKey: BigInteger,
    privKey: BigInteger
  ): PaillierEncryptionDomain {
    const builder = new PaillierEncryptionDomainBuilder(this.rngService);

    const domain = builder
      .withPubKey(pubKey)
      .withPrivKey(privKey)
      .withMod(pubKey)
      .build();

    return domain;
  }

  getAesEncryptionDomain(password: string): AesEncryptionDomain {
    const builder = new AesEncryptionDomainBuilder();

    const domain = builder.withPrivKey(password).build();

    return domain;
  }
}
