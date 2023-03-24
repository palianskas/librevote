import { BigInteger } from 'big-integer';
import { DiscreteNumber } from '../discrete-number.type';

export interface IEncryptor {
  encrypt(message: BigInteger, key: BigInteger, mod: BigInteger): BigInteger;
}

export interface IDecryptor {
  decrypt(cipher: BigInteger, key: BigInteger, mod: BigInteger): BigInteger;
}

export abstract class EncryptionDomain {
  protected encryptor: IEncryptor;
  protected decryptor: IDecryptor;
  protected pubKey: BigInteger;
  protected privKey: BigInteger;
  protected mod: BigInteger;

  setPubKey(key: BigInteger): void {
    this.pubKey = key;
  }
  setPrivKey(key: BigInteger): void {
    this.privKey = key;
  }
  setMod(mod: BigInteger): void {
    this.mod = mod;
  }
  setEncryptor(encryptor: IEncryptor): void {
    this.encryptor = encryptor;
  }
  setDecryptor(decryptor: IDecryptor): void {
    this.decryptor = decryptor;
  }

  abstract encrypt(message: DiscreteNumber): BigInteger;
  abstract decrypt(cipher: DiscreteNumber): BigInteger;
}
