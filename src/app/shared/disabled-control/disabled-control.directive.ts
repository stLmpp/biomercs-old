import {
  AfterViewInit,
  ContentChildren,
  Directive,
  Host,
  Input,
  Optional,
  QueryList,
} from '@angular/core';
import { AbstractControl, ControlContainer, NgControl } from '@angular/forms';
import { isUndefined } from 'is-what';

type DisabledControlAction = keyof Pick<AbstractControl, 'disable' | 'enable'>;

@Directive({
  selector:
    '[formControl][disabledControl],[formControlName][disabledControl],[formGroup][disabledControl],[formGroupName][disabledControl],[formArray][disabledControl],[formArrayName][disabledControl]',
})
export class DisabledControlDirective implements AfterViewInit {
  constructor(
    @Optional() @Host() ngControl: NgControl,
    @Optional() @Host() controlContainer: ControlContainer
  ) {
    this.ngControl = ngControl ?? controlContainer;
  }

  @ContentChildren(DisabledControlDirective, { descendants: true })
  disabledControlChildren: QueryList<DisabledControlDirective>;

  private _markForLater: boolean;
  private readonly ngControl: NgControl | ControlContainer;

  @Input() emitEvent = false;
  @Input() onlySelf = false;

  @Input()
  set disabledControl(disabled: boolean) {
    const action: DisabledControlAction = disabled ? 'disable' : 'enable';
    if (!this.ngControl?.control?.[action] || !this.disabledControlChildren) {
      this._markForLater = disabled;
    } else {
      this.ngControl?.control?.[action]?.({
        emitEvent: this.emitEvent,
        onlySelf: this.onlySelf,
      });
      if (this.disabledControlChildren?.length) {
        this.disabledControlChildren.forEach(child => {
          child?.ngControl?.control?.[action]?.({
            emitEvent: this.emitEvent,
            onlySelf: this.onlySelf,
          });
        });
      }
    }
  }

  ngAfterViewInit(): void {
    if (!isUndefined(this._markForLater)) {
      setTimeout(() => {
        this.disabledControl = this._markForLater;
      });
    }
  }
}
