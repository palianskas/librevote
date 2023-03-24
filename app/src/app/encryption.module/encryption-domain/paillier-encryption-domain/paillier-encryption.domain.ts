import * as bigInt from 'big-integer';
import { BigInteger } from 'big-integer';
import { DiscreteNumber } from '../../discrete-number.type';
import { EncryptionDomain } from '../encryption.domain';

export class PaillierEncryptionDomain extends EncryptionDomain {
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
