import { BigInteger } from 'big-integer';

export class KeyHelpers {
  static getDisplayableKey(key: string | null | BigInteger): string {
    if (!key) {
      return 'N/A';
    }

    if (typeof key != 'string') {
      key = key.toString();
    }

    if (key.length < 20) {
      return key;
    }

    return (
      key.substring(0, 8) + '...' + key.substring(key.length - 8, key.length)
    );
  }
}
