import * as bigInt from 'big-integer';
import { BigInteger } from 'big-integer';
import { RngService } from '../../services/rng.service';
import { IDecryptor, IEncryptor } from '../encryption.domain';
import { PaillierPrivKey, PaillierPubKey } from './paillier-encryption.domain';

export class PaillierEncryptor
  implements IEncryptor<BigInteger, PaillierPubKey, BigInteger>
{
  encrypt(message: BigInteger, key: PaillierPubKey): BigInteger {
    if (!this.validate(message, key.n)) {
      throw new Error(`Cannot encrypt message ${message} with mod ${key.n}`);
    }

    let r: BigInteger;
    while (true) {
      r = this.rngService.getRandomInt(key.n.bitLength().toJSNumber());

      if (r.lt(key.n) && bigInt.gcd(r, key.n).equals(bigInt.one)) {
        break;
      }
    }

    const n_squared = key.n.pow(2);

    const d1 = key.n.add(bigInt.one).modPow(message, n_squared);
    const d2 = r.modPow(key.n, n_squared);

    const cipher = d1.multiply(d2).mod(n_squared);

    // console.log('encrypt()', cipher, d1, d2);

    return cipher;
  }
  private rngService = new RngService();

  validate(message: BigInteger, mod: BigInteger): boolean {
    return message >= bigInt.zero && message < mod;
  }
}

export class PaillierDecryptor
  implements IDecryptor<BigInteger, PaillierPrivKey, BigInteger>
{
  decrypt(cipher: BigInteger, key: PaillierPrivKey): BigInteger {
    if (!this.validate(cipher, key.n)) {
      throw new Error(`Cannot decrypt message ${cipher} with mod ${key.n}`);
    }

    const n_squared = key.n.pow(2);

    const d1 = cipher.modPow(key.lambda, n_squared).minus(1);

    const sigma = key.lambda.modInv(key.n);

    const message = d1.divide(key.n).multiply(sigma).mod(key.n);

    // console.log('decrypt()', message, d1, sigma);

    return message;
  }

  validate(cipher: BigInteger, mod: BigInteger): boolean {
    return cipher > bigInt.zero && cipher.lt(mod.pow(2));
  }
}
