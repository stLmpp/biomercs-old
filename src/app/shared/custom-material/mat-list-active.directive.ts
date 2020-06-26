import { Directive, HostBinding, Input } from '@angular/core';
import { convertToBoolProperty } from '../../util/util';

@Directive({
  selector: 'mat-list-item[active], a[mat-list-item][active], button[mat-list-item][active]',
})
export class MatListActiveDirective {
  constructor() {}

  @Input() @HostBinding('class.active') active: boolean;
  @Input() indicatorPosition: 'left' | 'right' = 'left';
  @Input()
  set disableIndicator(value: '' | boolean) {
    this._disableIndicator = convertToBoolProperty(value);
  }
  private _disableIndicator = false;

  @HostBinding('class.left')
  get left(): boolean {
    return this.indicatorPosition === 'left';
  }

  @HostBinding('class.right')
  get right(): boolean {
    return !this._disableIndicator && this.indicatorPosition === 'right';
  }
}
