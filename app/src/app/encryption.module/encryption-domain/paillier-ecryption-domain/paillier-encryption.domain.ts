import * as bigInt from 'big-integer';
import { BigInteger } from 'big-integer';
import { DiscreteNumber } from '../../discrete-number.type';
import { EncryptionDomainBase } from '../encryption.domain';

export class PaillierPrivKey {
  lambda: BigInteger;
  n: BigInteger;
}

export class PaillierPubKey {
  n: BigInteger;
}

export class PaillierEncryptionDomain extends EncryptionDomainBase<
  BigInteger,
  PaillierPubKey,
  PaillierPrivKey,
  BigInteger
> {
  public override encrypt(message: DiscreteNumber): BigInteger {
    return this.encryptor.encrypt(
      this.toBigInteger(message),
      this.pubKey,
      this.mod
    );
  }

  public override decrypt(cipher: DiscreteNumber): BigInteger {
    return this.decryptor.decrypt(
      this.toBigInteger(cipher),
      this.privKey,
      this.mod
    );
  }

  private toBigInteger(number: DiscreteNumber): BigInteger {
    return typeof number === 'number' ? bigInt(number) : number;
  }
}
