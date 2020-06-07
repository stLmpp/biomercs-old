import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'mat-list-item[active], a[mat-list-item][active], button[mat-list-item][active]',
})
export class MatListActiveDirective {
  @Input() @HostBinding('class.active') active: boolean;
}
