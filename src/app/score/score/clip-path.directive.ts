import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { WINDOW } from '../../core/window.service';
import { fromEvent, Subject } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[clipPath]',
})
export class ClipPathDirective implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    @Inject(WINDOW) private window: Window,
    private ngZone: NgZone
  ) {}

  private _destroy$ = new Subject();

  @Input() clipPath: number | string;
  @Input() height: number | string = 36;

  setStyle(): void {
    const polygon =
      +this.clipPath === 1
        ? `polygon(0 0, 100% 0, 100% 100%, ${+this.height / 1.5}px 100%)`
        : `polygon(0 0, 100% 0, ${this.elementRef.nativeElement.getBoundingClientRect().width -
            +this.height / 1.5}px 100%, 0 100%)`;
    this.renderer2.setStyle(this.elementRef.nativeElement, 'clip-path', polygon);
  }

  ngOnInit(): void {
    if (+this.clipPath === 2) {
      this.ngZone.runOutsideAngular(() => {
        fromEvent(this.window, 'resize', { passive: true })
          .pipe(takeUntil(this._destroy$), auditTime(50))
          .subscribe(() => {
            this.setStyle();
          });
      });
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setStyle();
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
