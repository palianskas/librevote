export class StringHelpers {
  static dateToString(date?: Date): string {
    return date?.toLocaleString() ?? '(Manual control)';
  }
}
