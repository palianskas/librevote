import * as bigInt from 'big-integer';
import { BigInteger } from 'big-integer';
import { jsbn, pki } from 'node-forge';

export class RngService {
  getRandomInt(bits = 1024): BigInteger {
    const array = new Uint32Array(Math.ceil(bits / 32));
    window.crypto.getRandomValues(array);

    let res = bigInt.one;

    array.forEach((val) => {
      res.multiply(val);
    });

    return res;
  }

  async getRandomPrimePair(
    bits = 1024
  ): Promise<{ p: BigInteger; q: BigInteger }> {
    let onResolve: Function;
    const primePairPromise = new Promise<{ p: BigInteger; q: BigInteger }>(
      (resolve) => {
        onResolve = resolve;
      }
    );

    // use sync generator if bit size is small to bypass js-workers bug
    if (bits < 256) {
      const { privateKey } = pki.rsa.generateKeyPair({
        bits: bits,
      });

      const p = this.toBigInteger(privateKey.p);
      const q = this.toBigInteger(privateKey.q);

      onResolve({ p, q });
    } else {
      pki.rsa.generateKeyPair(
        { bits: bits, workers: 2 },
        (_, { privateKey }) => {
          const p = this.toBigInteger(privateKey.p);
          const q = this.toBigInteger(privateKey.q);

          onResolve({ p, q });
        }
      );
    }

    return primePairPromise;
  }

  private toBigInteger(integer: jsbn.BigInteger): BigInteger {
    return bigInt(integer.toString(10));
  }
}
