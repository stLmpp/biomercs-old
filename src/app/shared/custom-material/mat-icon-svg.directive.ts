import { Directive, Input } from '@angular/core';
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

  private flagExists(flag: string): boolean {
    return flagIcons.some(({ name }) => name.replace('.svg') === flag);
  }
}
