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

@Directive({
  selector: '[error]',
})
export class MatErrorControlDirective implements OnInit, OnDestroy {
  constructor(
    @Optional() @Host() private matFormField: MatFormField,
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<MatErrorControlDirective>
  ) {
    if (!this.matFormField) {
      console.warn('"ErrorDirective" must be used inside a MatFormField');
    }
  }

  private _destroy$ = new Subject();

  @Input() error: string;

  private isShow = false;

  showError(): void {
    if (!this.isShow) {
      this.isShow = true;
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  hideError(): void {
    if (this.isShow) {
      this.isShow = false;
      this.viewContainerRef.clear();
    }
  }

  ngOnInit(): void {
    this.viewContainerRef.clear();
    this.matFormField?._control.stateChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        if (
          this.matFormField._control.errorState &&
          this.matFormField._control.ngControl.hasError(this.error)
        ) {
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
