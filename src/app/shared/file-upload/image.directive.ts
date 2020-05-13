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

@Directive({
  selector: 'img[auth][src]',
})
export class ImageDirective implements OnInit, OnDestroy {
  constructor(private fileUploadService: FileUploadService) {}

  private _destroy$ = new Subject();

  @Input()
  set src(id: number) {
    this._src = null;
    this.loading.emit(true);
    this.fileUploadService
      .findById(id)
      .pipe(
        takeUntil(this._destroy$),
        finalize(() => {
          this.loading.emit(false);
        })
      )
      .subscribe(img => {
        this._src = img;
      });
  }
  @Input() alt: string;

  @Output() loading = new EventEmitter<boolean>();

  @HostBinding('src') _src: string;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
