import { BigInteger } from 'big-integer';
import { EncryptionService } from '../services/encryption.service';

export class KeyContainerContext {
  campaignId: string;
}

export class KeyContainer {
  private _key: BigInteger;
  private _salt?: string;
  private _password?: string;

  context: KeyContainerContext;

  constructor(
    key: BigInteger,
    context: KeyContainerContext,
    password?: string
  ) {
    this._key = key;
    this.context = context;

    const { saltedPassword, salt } = EncryptionService.saltPassword(password);

    this._password = saltedPassword;
    this._salt = salt;
  }

  extract(password?: string): BigInteger | null {
    if (!this._password) {
      return this._key;
    }

    if (!password) {
      return null;
    }

    if (!EncryptionService.isMatch(password, this._password, this._salt)) {
      return null;
    }

    return this._key;
  }
}
