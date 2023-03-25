import { EncryptionService } from '../services/encryption.service';

export class KeyContainerContext {
  campaignId: string;

  static isValidContext(data: any): boolean {
    return !!data?.campaignId;
  }
}

export class KeyContainer {
  private _key: string;
  private _salt?: string;
  private _password?: string;

  context: KeyContainerContext;

  constructor(
    key: string,
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

  getKey(): string {
    return this._key;
  }

  canAccessKey(password?: string): boolean {
    if (!this._password && !this._salt && !password) {
      return true;
    }

    return EncryptionService.isMatch(password, this._password, this._salt);
  }

  get isPasswordProtected(): boolean {
    return !!this._password;
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
      data._key,
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
      !!data && !!data._key && KeyContainerContext.isValidContext(data.context);

    return isValid;
  }
}
