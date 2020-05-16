import {
  Directive,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { FileUploadService } from './file-upload.service';
import { Subject } from 'rxjs';
import { isString } from 'is-what';
import { catchHttpError } from '../../util/operators/catchError';

@Directive({
  selector: 'img[auth][src]',
})
export class ImageDirective implements OnInit, OnDestroy {
  constructor(private fileUploadService: FileUploadService) {}

  private _destroy$ = new Subject();

  @Input()
  set src(id: number | string) {
    this._src = null;
    this.loading.emit(true);
    const http = isString(id)
      ? this.fileUploadService.findByName(id)
      : this.fileUploadService.findById(id);
    http
      .pipe(
        takeUntil(this._destroy$),
        finalize(() => {
          this.loading.emit(false);
        }),
        catchHttpError(() => {
          this.imgError.emit();
        })
      )
      .subscribe(img => {
        this._src = img;
      });
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
