// import {
//   EncryptionDomainBase,
//   IDecryptor,
//   IEncryptor,
// } from './encryption.domain';

// export class EncryptionDomainBuilder<TDomain> {
//   // private domain: EncryptionDomainBase<TData, TPubKey, TPrivKey, TMod>;
//   private domain: TDomain;

//   constructor() {
//     this.domain = new();
//   }

//   withPrivKey(key: TPrivKey): this {
//     this.domain.setPrivKey(key);

//     return this;
//   }

//   withPubKey(key: TPubKey): this {
//     this.domain.setPubKey(key);

//     return this;
//   }

//   withMod(mod: TMod): this {
//     this.domain.setMod(mod);

//     return this;
//   }

//   withEncryptor(encryptor: IEncryptor<TData, TPubKey, TMod>): this {
//     this.domain.setEncryptor(encryptor);

//     return this;
//   }

//   withDecryptor(decryptor: IDecryptor<TData, TPrivKey, TMod>): this {
//     this.domain.setDecryptor(decryptor);

//     return this;
//   }

//   build(): EncryptionDomainBase<TData, TPubKey, TPrivKey, TMod> {
//     return this.domain;
//   }
// }
