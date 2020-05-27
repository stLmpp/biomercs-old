import { Directive, HostBinding, Input } from '@angular/core';
import { Region } from '../../model/region';
import { MatIcon } from '@angular/material/icon';
import { isString } from 'is-what';
import { flagIcons } from '../../../assets/flags/config.js';

@Directive({ selector: 'mat-icon[svgIcon]' })
export class MatIconSvgDirective {
  constructor(private matIcon: MatIcon) {}

  @Input()
  set region(region: Region | string) {
    const shortName = isString(region) ? region : region.shortName;
    let regionIcon = 'flag-' + shortName.toLowerCase();
    if (!this.flagExists(regionIcon)) {
      regionIcon = 'flag-unknown';
    }
    this.matIcon.svgIcon = regionIcon;
    this.matIcon.ngOnChanges({
      svgIcon: {
        currentValue: regionIcon,
        firstChange: false,
        previousValue: this._regionIcon,
        isFirstChange(): boolean {
          return false;
        },
      },
    });
    this._regionIcon = regionIcon;
  }

  private _regionIcon: string;

  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  @HostBinding('class.xs') get xs(): boolean {
    return this.size === 'xs';
  }
  @HostBinding('class.sm') get sm(): boolean {
    return this.size === 'sm';
  }
  @HostBinding('class.md') get md(): boolean {
    return this.size === 'md';
  }
  @HostBinding('class.lg') get lg(): boolean {
    return this.size === 'lg';
  }
  @HostBinding('class.xl') get xl(): boolean {
    return this.size === 'xl';
  }

  private flagExists(flag: string): boolean {
    return flagIcons.some(({ name }) => name.replace('.svg') === flag);
  }
}
