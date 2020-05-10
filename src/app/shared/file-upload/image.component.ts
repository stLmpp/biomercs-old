import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { FileUploadService } from './file-upload.service';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-image',
  template: `
    <mat-spinner *ngIf="loading"></mat-spinner>
    <img *ngIf="src && !loading" [src]="src" [alt]="alt" />
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        align-content: center;
        min-height: 130px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent implements OnInit, OnDestroy {
  constructor(
    private fileUploadService: FileUploadService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  private _destroy$ = new Subject();

  @Input()
  set id(id: number) {
    this.src = null;
    this.loading = true;
    this.fileUploadService
      .findById(id)
      .pipe(
        takeUntil(this._destroy$),
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(img => {
        this.src = img;
      });
  }
  @Input() alt: string;

  src: string;

  loading = false;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
