export class ValidationHelpers {
  private static readonly basicEmailRegex = new RegExp(/^\S+@\S+$/);

  static isEmail(value: string): boolean {
    return this.basicEmailRegex.test(value);
  }
}
