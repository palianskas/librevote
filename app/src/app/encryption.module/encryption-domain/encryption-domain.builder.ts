import { BigInteger } from 'big-integer';
import { EncryptionDomain, IDecryptor, IEncryptor } from './encryption.domain';

export interface IEncryptionDomainBuilder {
  withPrivKey(key: BigInteger): this;
  withPubKey(key: BigInteger): this;
  withMod(mod: BigInteger): this;
  withEncryptor(encryptor: IEncryptor): this;
  withDecryptor(decryptor: IDecryptor): this;
  build(): EncryptionDomain;
}
