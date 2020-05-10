import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector:
    '[mat-dialog-actions][align], mat-dialog-actions[align], [matDialogActions][align]',
})
export class MatDialogActionsAlignDirective {
  @Input() align: 'end' | 'start' = 'start';

  @HostBinding('class.align-end')
  get alignEnd(): boolean {
    return this.align === 'end';
  }

  @HostBinding('class.align-start')
  get alignStart(): boolean {
    return this.align === 'start';
  }
}
