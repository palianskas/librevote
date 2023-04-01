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
    password: string | null | { value: string; salt: string },
    private readonly encryptionService: EncryptionService
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

    return this.encryptionService.isMatch(password, this._password, this._salt);
  }

  get isPasswordProtected(): boolean {
    return !!this._password;
  }

  private _saveSaltedPassword(password: string): void {
    const { saltedPassword, salt } =
      this.encryptionService.saltPassword(password);

    this._password = saltedPassword;
    this._salt = salt;
  }
}
