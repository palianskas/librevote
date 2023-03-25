import * as bigInt from 'big-integer';
import { BigInteger } from 'big-integer';
import { RngService } from '../../services/rng.service';
import { IDecryptor, IEncryptor } from '../encryption.domain';

export class PaillierEncryptor implements IEncryptor<BigInteger> {
  encrypt(message: BigInteger, pubKey: BigInteger): BigInteger {
    if (!this.validate(message, pubKey)) {
      throw new Error(`Cannot encrypt message ${message} with mod ${pubKey}`);
    }

    let r: BigInteger;
    while (true) {
      r = RngService.getRandomInt(pubKey.bitLength().toJSNumber());

      if (r.lt(pubKey) && bigInt.gcd(r, pubKey).equals(bigInt.one)) {
        break;
      }
    }

    const n_squared = pubKey.pow(2);

    const d1 = pubKey.add(bigInt.one).modPow(message, n_squared);
    const d2 = r.modPow(pubKey, n_squared);

    const cipher = d1.multiply(d2).mod(n_squared);

    return cipher;
  }

  validate(message: BigInteger, mod: BigInteger): boolean {
    return message.geq(bigInt.zero) && message.lesser(mod);
  }
}

export class PaillierDecryptor implements IDecryptor<BigInteger> {
  decrypt(
    cipher: BigInteger,
    privKey: BigInteger,
    mod: BigInteger
  ): BigInteger {
    if (!this.validate(cipher, mod)) {
      throw new Error(`Cannot decrypt message ${cipher} with mod ${privKey}`);
    }

    const n_squared = mod.pow(2);

    const d1 = cipher.modPow(privKey, n_squared).minus(1);

    const sigma = privKey.modInv(mod);

    const message = d1.divide(mod).multiply(sigma).mod(mod);

    return message;
  }

  validate(cipher: BigInteger, mod: BigInteger): boolean {
    return cipher.greater(bigInt.zero) && cipher.lt(mod.pow(2));
  }
}
