import { EncryptionService } from '../encryption.service';

export class KeyContainerContext {
  campaignId: string;

  static isValidContext(data: any): boolean {
    return !!data?.campaignId;
  }
}

export class KeyContainer {
  private key: string;
  private salt?: string;
  private password?: string;

  context: KeyContainerContext;

  constructor(
    key: string,
    context: KeyContainerContext,
    password: string | null | { value: string; salt: string },
    private readonly encryptionService: EncryptionService
  ) {
    this.key = key;
    this.context = context;

    if (!password) {
      return;
    }

    if (typeof password === 'string') {
      this.saveSaltedPassword(password);
    } else {
      this.password = password.value;
      this.salt = password.salt;
    }
  }

  getKey(): string {
    return this.key;
  }

  canAccessKey(password?: string): boolean {
    if (!this.password && !this.salt && !password) {
      return true;
    }

    return this.encryptionService.isMatch(password, this.password, this.salt);
  }

  get isPasswordProtected(): boolean {
    return !!this.password;
  }

  private saveSaltedPassword(password: string): void {
    const { saltedPassword, salt } =
      this.encryptionService.saltPassword(password);

    this.password = saltedPassword;
    this.salt = salt;
  }
}
