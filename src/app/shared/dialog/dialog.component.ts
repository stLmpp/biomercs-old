import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { isObservable, Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

export interface DialogOptions<T = any> {
  title: string;
  content: string;
  btnYes: string;
  btnNo: string;
  alignBtn: 'end' | 'start';
  observable?: Observable<T>;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogOptions,
    private matDialogRef: MatDialogRef<DialogComponent>,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.data = {
      ...{ alignBtn: 'end', btnYes: 'Yes', btnNo: 'No' },
      ...this.data,
    };
  }

  private _destroy$ = new Subject();

  loading = false;

  yes(): void {
    if (isObservable(this.data.observable)) {
      this.loading = true;
      this.matDialogRef.disableClose = true;
      this.data.observable
        .pipe(
          takeUntil(this._destroy$),
          finalize(() => {
            this.loading = false;
            this.matDialogRef.disableClose = false;
            this.changeDetectorRef.markForCheck();
          })
        )
        .subscribe(() => {
          this.loading = false;
          this.matDialogRef.close(true);
        });
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
