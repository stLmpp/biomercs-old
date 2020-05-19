import {
  Directive,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { FileUploadService } from './file-upload.service';
import { Subject } from 'rxjs';
import { isString } from 'is-what';
import { catchHttpError } from '../../util/operators/catchError';
import { isNil } from '../../util/util';

@Directive({
  selector: 'img[auth][src]',
})
export class ImageDirective implements OnInit, OnDestroy {
  constructor(private fileUploadService: FileUploadService) {}

  private _destroy$ = new Subject();

  hasError = false;

  @Input()
  set src(id: number | string) {
    this._src = null;
    if (isNil(id)) {
      this.imgError.emit();
      this.hasError = true;
    } else {
      this.loading.emit(true);
      const http = isString(id)
        ? this.fileUploadService.findByName(id)
        : this.fileUploadService.findById(id);
      http
        .pipe(
          takeUntil(this._destroy$),
          tap(() => {
            this.hasError = false;
          }),
          finalize(() => {
            this.loading.emit(false);
          }),
          catchHttpError(() => {
            this.imgError.emit();
            this.hasError = true;
          })
        )
        .subscribe(img => {
          this._src = img;
        });
    }
  }

  @Output() loading = new EventEmitter<boolean>();
  @Output() imgError = new EventEmitter<void>();

  @HostBinding('src') _src: string;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
