import * as bigInt from 'big-integer';
import { BigInteger } from 'big-integer';
import { DiscreteNumber } from '../../discrete-number.type';
import { EncryptionDomain } from '../encryption.domain';

export class PaillierEncryptionDomain extends EncryptionDomain<BigInteger> {
  override encrypt(message: DiscreteNumber): BigInteger {
    message = this.toBigInteger(message);

    return super.encrypt(message);
  }

  override decrypt(cipher: DiscreteNumber): BigInteger {
    cipher = this.toBigInteger(cipher);

    return super.decrypt(cipher);
  }

  private toBigInteger(number: DiscreteNumber): BigInteger {
    return typeof number === 'number' ? bigInt(number) : number;
  }
}
