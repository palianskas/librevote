import * as bigInt from 'big-integer';
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
    password: string | null | { value: string; salt: string }
  ) {
    this._key = key;
    this.context = context;

    if (!password) {
      return;
    }

    if (typeof password === 'string') {
      this._saveSaltedPassword(password);
    } else {
      this._password = password.value;
      this._salt = password.salt;
    }
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

  private _saveSaltedPassword(password: string): void {
    const { saltedPassword, salt } = EncryptionService.saltPassword(password);

    this._password = saltedPassword;
    this._salt = salt;
  }

  static map(data: any): KeyContainer | null {
    const isValid = this.isValidContainer(data);

    if (!isValid) {
      return null;
    }

    const container = new KeyContainer(
      bigInt(data._key),
      data.context as KeyContainerContext,
      {
        value: data._password,
        salt: data._salt,
      }
    );

    return container;
  }

  private static isValidContainer(data: any): boolean {
    const isValid =
      !!data &&
      !!data._key &&
      !!data.context &&
      !!data.context.campaignId &&
      !!data._password &&
      !!data._salt;

    return isValid;
  }
}
