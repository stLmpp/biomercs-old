import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
} from '@angular/core';
import { ImageDirective } from '../file-upload/image.directive';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: 'img[default]',
})
export class DefaultImageDirective implements OnInit, OnDestroy {
  constructor(
    private elementRef: ElementRef,
    private renderer2: Renderer2,
    @Optional() private imageDirective: ImageDirective
  ) {}

  private _destroy$ = new Subject();

  @Input() default: number | string;

  @HostListener('error')
  onError(): void {
    if (!this.imageDirective) {
      this._onError();
    }
  }

  private _onError(): void {
    if (this.imageDirective) {
      this.imageDirective.src = this.default;
    } else {
      this.renderer2.setAttribute(
        this.elementRef.nativeElement,
        'src',
        '' + this.default
      );
    }
  }

  ngOnInit(): void {
    this.imageDirective?.imgError
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        this._onError();
      });
  }

  ngOnDestroy(): void {}
}
