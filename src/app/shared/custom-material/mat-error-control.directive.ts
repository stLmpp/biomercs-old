import {
  Directive,
  Host,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatFormField } from '@angular/material/form-field';
import { isAnyObject, isArray, isString } from 'is-what';

export class MatErrorContext {
  // TODO add typing (generics maybe?)
  constructor(public $implicit: any | { [key: string]: any }) {}
}

@Directive({
  selector: '[error]',
})
export class MatErrorControlDirective implements OnInit, OnDestroy {
  constructor(
    @Optional() @Host() private matFormField: MatFormField,
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<MatErrorContext>
  ) {
    if (!this.matFormField) {
      console.warn('"ErrorDirective" must be used inside a MatFormField');
    }
  }

  private _destroy$ = new Subject();

  @Input() error: string | string[] | { [key: string]: boolean };
  @Input() condition: 'and' | 'or' = 'and';

  private isShow = false;

  showError(): void {
    if (!this.isShow) {
      this.isShow = true;
      this.viewContainerRef.createEmbeddedView(this.templateRef, new MatErrorContext(this.getError()));
    }
  }

  hideError(): void {
    if (this.isShow) {
      this.isShow = false;
      this.viewContainerRef.clear();
    }
  }

  private getError(): any | { [key: string]: any } {
    if (isString(this.error)) {
      return this.matFormField._control.ngControl.getError(this.error);
    } else if (isArray(this.error)) {
      return this.error.reduce((acc, item) => {
        if (this.matFormField._control.ngControl.hasError(item)) {
          return {
            ...acc,
            [item]: this.matFormField._control.ngControl.getError(item),
          };
        } else {
          return acc;
        }
      }, {});
    } else {
      return Object.entries(this.error).reduce((acc, [key, value]) => {
        if (value && this.matFormField._control.ngControl.hasError(key)) {
          return {
            ...acc,
            [key]: this.matFormField._control.ngControl.getError(key),
          };
        } else {
          return acc;
        }
      }, {});
    }
  }

  private checkErrors(): boolean {
    if (isString(this.error)) {
      return this.matFormField._control.ngControl.hasError(this.error);
    } else if (isArray(this.error)) {
      return this.error[this.condition === 'or' ? 'some' : 'every'](err =>
        this.matFormField._control.ngControl.hasError(err)
      );
    } else if (isAnyObject(this.error)) {
      return Object.entries(this.error).every(
        ([key, value]) => this.matFormField._control.ngControl.hasError(key) === value
      );
    }
  }

  ngOnInit(): void {
    this.viewContainerRef.clear();
    this.matFormField?._control.stateChanges.pipe(takeUntil(this._destroy$)).subscribe(() => {
      if (this.matFormField._control.errorState && this.checkErrors()) {
        this.showError();
      } else {
        this.hideError();
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
