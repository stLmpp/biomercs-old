import { Directive, forwardRef, OnDestroy, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { filter, pluck, takeUntil } from 'rxjs/operators';

@Directive({
  selector: 'mat-paginator[formControlName], mat-paginator[formControl]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatPaginatorDirective),
      multi: true,
    },
  ],
})
export class MatPaginatorDirective implements ControlValueAccessor, OnInit, OnDestroy {
  constructor(@Self() private matPaginator: MatPaginator) {}

  private _destroy$ = new Subject();

  onChange = (page: number) => {};
  onTouched = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.matPaginator.disabled = isDisabled;
  }

  writeValue(page: number): void {
    this.matPaginator.pageIndex = page;
  }

  ngOnInit(): void {
    this.matPaginator.page
      .pipe(
        takeUntil(this._destroy$),
        filter(pageEvent => pageEvent.pageIndex !== pageEvent.previousPageIndex),
        pluck('pageIndex')
      )
      .subscribe(page => {
        this.onChange(page);
        this.onTouched();
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
