import { formatDate } from '@angular/common';

export class StringHelpers {
  static campaignDateTimeToString(date?: Date): string {
    return date?.toLocaleString() ?? '(Manual control)';
  }

  static dateTimeToIsoString(date: Date): string {
    return formatDate(date, 'yyyy-MM-ddTHH:mm', 'en');
  }

  static dateTimeToString(date: Date): string {
    return date.toLocaleString();
  }
}
