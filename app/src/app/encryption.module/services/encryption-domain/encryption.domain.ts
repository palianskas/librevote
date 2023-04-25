export interface IEncryptor<T> {
  encrypt(message: T, key: T, mod: T): T;
}

export interface IDecryptor<T> {
  decrypt(cipher: T, key: T, mod: T): T | null;
}

export abstract class EncryptionDomain<T> {
  protected encryptor: IEncryptor<T>;
  protected decryptor: IDecryptor<T>;
  protected pubKey: T;
  protected privKey: T;
  protected mod: T;

  setPubKey(key: T): void {
    this.pubKey = key;
  }
  setPrivKey(key: T): void {
    this.privKey = key;
  }
  setMod(mod: T): void {
    this.mod = mod;
  }
  setEncryptor(encryptor: IEncryptor<T>): void {
    this.encryptor = encryptor;
  }
  setDecryptor(decryptor: IDecryptor<T>): void {
    this.decryptor = decryptor;
  }

  encrypt(message: T): T {
    return this.encryptor.encrypt(message, this.pubKey, this.mod);
  }
  decrypt(cipher: T): T | null {
    return this.decryptor.decrypt(cipher, this.privKey, this.mod);
  }
}
