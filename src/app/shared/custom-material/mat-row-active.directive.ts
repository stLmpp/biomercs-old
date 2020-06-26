import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'mat-row[active], [matRow][active], [mat-row][active]',
})
export class MatRowActiveDirective {
  constructor() {}

  @Input() @HostBinding('class.active') active: boolean;
}
