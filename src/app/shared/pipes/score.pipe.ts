import { Inject, InjectionToken, LOCALE_ID, Optional, Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

export const SCORE_DEFAULT_DIGITS = new InjectionToken<string>('SCORE_DEFAULT_DIGITS');

@Pipe({
  name: 'score',
})
export class ScorePipe implements PipeTransform {
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    @Optional()
    @Inject(SCORE_DEFAULT_DIGITS)
    private defaultDigits: string
  ) {}

  transform(value: number, digitsInfo?: string, locale?: string): unknown {
    return formatNumber(value, locale ?? this.locale, digitsInfo ?? this.defaultDigits ?? '1.0-0')
      .split('.')
      .join(',');
  }
}
