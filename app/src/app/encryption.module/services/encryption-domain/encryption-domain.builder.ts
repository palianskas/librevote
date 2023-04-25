import { EncryptionDomain, IDecryptor, IEncryptor } from './encryption.domain';

export interface IEncryptionDomainBuilder<T> {
  withPrivKey(key: T): this;
  withPubKey(key: T): this;
  withMod(mod: T): this;
  withEncryptor(encryptor: IEncryptor<T>): this;
  withDecryptor(decryptor: IDecryptor<T>): this;
  build(): EncryptionDomain<T>;
}
