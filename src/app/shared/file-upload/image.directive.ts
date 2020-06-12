import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { isString } from 'is-what';
import { isNil } from '../../util/util';
import { environment } from '../../../environments/environment';

@Directive({
  selector: 'img[auth][src]',
})
export class ImageDirective implements OnInit, OnDestroy {
  constructor() {}

  private _destroy$ = new Subject();

  hasError = false;

  @Input()
  set src(id: number | string) {
    this._src = null;
    if (isNil(id)) {
      this.imgError.emit();
      this.hasError = true;
    } else {
      this._src = `${environment.api}${isString(id) ? environment.uploadName : environment.uploadId}/${id}`;
    }
  }

  @Output() imgError = new EventEmitter<void>();

  @HostBinding('src') _src: string;

  @HostListener('error')
  onError(): void {
    this.imgError.emit();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
