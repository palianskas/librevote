export class BrowserHelpers {
  static async copyToClipboard(value: string): Promise<void> {
    await navigator.clipboard.writeText(value);
  }
}
