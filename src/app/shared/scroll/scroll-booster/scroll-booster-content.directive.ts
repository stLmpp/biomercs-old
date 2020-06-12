import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
} from '@angular/core';
import { SrollBoosterItemDirective } from './sroll-booster-item.directive';
import { Subject } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[scrollBoosterContent]',
})
export class ScrollBoosterContentDirective implements OnInit, OnDestroy, AfterContentInit {
  constructor(public elementRef: ElementRef<Element>) {}

  private _destroy$ = new Subject();

  @ContentChildren(SrollBoosterItemDirective, { descendants: true }) dragItems: QueryList<
    SrollBoosterItemDirective
  >;

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    this.dragItems.changes.pipe(takeUntil(this._destroy$), auditTime(50)).subscribe(changes => {
      if (changes?.length === 1) {
        this.dragItems.first.elementRef.nativeElement.focus();
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
