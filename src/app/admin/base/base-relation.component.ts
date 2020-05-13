import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { Subject } from 'rxjs';
import { CommonColumns } from '../../model/common-history';
import { convertToBoolProperty, trackByFactory } from '../../util/util';
import { SuperService } from '../../shared/super/super-service';
import { finalize, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HandleErrorService } from '../../core/error/handle-error.service';

@Component({
  selector: 'app-base-relation',
  templateUrl: './base-relation.component.html',
  styleUrls: ['./base-relation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseRelationComponent implements OnInit, OnDestroy {
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private matSnackBar: MatSnackBar,
    public matDialog: MatDialog,
    private handleErrorService: HandleErrorService
  ) {}

  private _destroy$ = new Subject();

  filesAllowed = 'image/jpg, image/png, image/gif';

  @Input() one: CommonColumns[] = [];
  @Input() oneLabel: string | string[];
  @Input() oneIdKey: string;
  @Input() many: CommonColumns[] = [];
  @Input() manyLabel: string;
  @Input() manyIdKey: string;
  @Input() entities: CommonColumns[] = [];
  @Input() idKey = 'id';
  @Input() service: SuperService<any>;
  @Input() showCount = true;

  @Input('uploadImage')
  set _uploadImage(allowed: '' | boolean) {
    this.uploadImage = convertToBoolProperty(allowed);
  }
  uploadImage = false;

  @Input() imageKey: string;

  @Input() trackBy: TrackByFunction<CommonColumns> = trackByFactory('id');
  trackByLabel = trackByFactory<string>();

  loading: { [key: string]: boolean } = {};

  openState: { [key: number]: boolean } = {};

  setOpenState(index: number, state: boolean): void {
    this.openState = {
      ...this.openState,
      [index]: state,
    };
  }

  private setLoading(idOne: number, idMany: number, loading: boolean): void {
    const key = idOne + '-' + idMany;
    this.loading = {
      ...this.loading,
      [key]: loading,
    };
    this.changeDetectorRef.markForCheck();
  }

  onChange(
    one: CommonColumns,
    many: CommonColumns,
    entity?: CommonColumns
  ): void {
    if (entity) {
      this.service
        .delete(entity.id)
        .pipe(this.handleErrorService.handleErrorOperator())
        .subscribe();
    } else {
      this.setLoading(one.id, many.id, true);
      this.service
        .add({
          [this.oneIdKey]: one.id,
          [this.manyIdKey]: many.id,
        })
        .pipe(
          finalize(() => {
            this.setLoading(one.id, many.id, false);
          })
        )
        .subscribe();
    }
  }

  fileUpload(entity: CommonColumns, $event: Event): void {
    if (entity.uploading) return;
    const file = ($event.target as HTMLInputElement).files[0];
    if (!file) return;
    this.service
      .uploadFile(entity.id, file)
      .pipe(
        tap(() => {
          this.matSnackBar.open(`Image uploaded successfully!`, 'Close');
        })
      )
      .subscribe();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
