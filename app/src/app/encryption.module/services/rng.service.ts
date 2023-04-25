import { Injectable } from '@angular/core';
import * as bigInt from 'big-integer';
import { BigInteger } from 'big-integer';
import { jsbn, pki, random } from 'node-forge';

@Injectable({ providedIn: 'root' })
export class RngService {
  getRandomInt(bits = 2048): BigInteger {
    const string = random.getBytesSync(Math.ceil(bits / 32));
    const buffer = this.toArrayBuffer(string);
    const array = new Uint32Array(buffer);

    window.crypto.getRandomValues(array);

    let res = bigInt.one;

    array.forEach((val) => {
      res = res.multiply(val);
    });

    return res;
  }

  async getRandomPrimePair(
    bits = 4096
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

  async generatePaillierKeyPair(bits = 2048): Promise<{
    lambda: BigInteger;
    n: BigInteger;
  }> {
    const { p, q } = await this.getRandomPrimePair(bits);

    const n = p.multiply(q);
    const lambda = p.minus(1).multiply(q.minus(1));

    return { lambda, n };
  }

  private toBigInteger(integer: jsbn.BigInteger): BigInteger {
    return bigInt(integer.toString(10));
  }

  private toArrayBuffer(string: string): ArrayBuffer {
    const buffer = new ArrayBuffer(string.length * 2);
    let bufferView = new Uint16Array(buffer);

    for (let i = 0; i < string.length; i++) {
      bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
  }
}
