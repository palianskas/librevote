export interface IEncryptor<TData, TKey, TMod> {
  encrypt(message: TData, key: TKey, mod: TMod): TData;
}

export interface IDecryptor<TData, TKey, TMod> {
  decrypt(cipher: TData, key: TKey, mod: TMod): TData;
}

export abstract class EncryptionDomainBase<TData, TPubKey, TPrivKey, TMod> {
  protected encryptor: IEncryptor<TData, TPubKey, TMod>;
  protected decryptor: IDecryptor<TData, TPrivKey, TMod>;
  protected pubKey: TPubKey;
  protected privKey: TPrivKey;
  protected mod: TMod;

  setPubKey(key: TPubKey): void {
    this.pubKey = key;
  }
  setPrivKey(key: TPrivKey): void {
    this.privKey = key;
  }
  setMod(mod: TMod): void {
    this.mod = mod;
  }
  setEncryptor(encryptor: IEncryptor<TData, TPubKey, TMod>): void {
    this.encryptor = encryptor;
  }
  setDecryptor(decryptor: IDecryptor<TData, TPrivKey, TMod>): void {
    this.decryptor = decryptor;
  }

  abstract encrypt(message: TData): TData;
  abstract decrypt(cipher: TData): TData;
}
