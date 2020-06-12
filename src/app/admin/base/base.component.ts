import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  TemplateRef,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { convertToBoolProperty } from '../../util/util';
import { FormControl, FormGroup } from '@ng-stack/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, finalize, take, takeUntil, tap } from 'rxjs/operators';
import { CommonColumns } from '../../model/common-history';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchHttpError } from '../../util/operators/catchError';
import { SuperService } from '../../shared/super/super-service';
import { trackByFactory } from '@stlmpp/utils';
import {
  BaseAddEditComponent,
  BaseAddEditOptions,
  FieldsConfig,
} from './base-add-edit/base-add-edit.component';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseComponent implements OnInit, OnDestroy, OnChanges {
  constructor(
    private matDialog: MatDialog,
    public changeDetectorRef: ChangeDetectorRef,
    private matSnackBar: MatSnackBar
  ) {}

  private _destroy$ = new Subject();

  @ViewChild('deleteRef', { read: TemplateRef }) deleteTemplateRef: TemplateRef<any>;
  @ViewChild('imageRef', { read: TemplateRef }) imageTemplateRef: TemplateRef<any>;

  loading = false;

  trackByLabel = trackByFactory<string>();

  searchControl = new FormControl();
  search$ = this.searchControl.valueChanges.pipe(debounceTime(300));

  filesAllowed = 'image/jpg, image/png, image/gif';

  @Input() service: SuperService<any>;
  @Input()
  set fields(fields: string[]) {
    this.addFields = fields;
    this.updateFields = fields;
    this.matLineLabels = fields;
    this.searchBy = fields;
  }

  @Input() addFields: string[] = [];
  @Input() updateFields: string[] = [];
  @Input() searchBy: string[];
  @Input() fieldsConfig: FieldsConfig = {};

  @Input() idKey = 'id';
  @Input() matLineLabels: string[];
  @Input() matLineExtras: TemplateRef<any>;
  @Input()
  updateLabel: string;
  @Input() entityName: string;

  @Input() entities: CommonColumns[];

  @Input('deleteAllowed')
  set _deleteAllowed(allowed: '' | boolean) {
    this.deleteAllowed = convertToBoolProperty(allowed);
  }
  deleteAllowed = false;

  @Input('uploadImage')
  set _uploadImage(allowed: '' | boolean) {
    this.uploadImage = convertToBoolProperty(allowed);
  }
  uploadImage = false;

  @Input() imageKey: string;
  @Input() imageLabel: string;

  @Input() trackBy: TrackByFunction<CommonColumns> = (index, element) => element.id;

  private setForm(fields: string[], data?: any): FormGroup {
    return fields.reduce((formGroup, key) => {
      formGroup.addControl(
        key,
        new FormControl(
          data?.[key] ?? null,
          this.fieldsConfig[key]?.validators ?? [],
          this.fieldsConfig[key]?.asyncValidators ?? []
        )
      );
      return formGroup;
    }, new FormGroup({}));
  }

  openAdd(): void {
    this.matDialog.open(BaseAddEditComponent, {
      data: {
        fieldsConfig: this.fieldsConfig,
        fields: this.addFields,
        entityName: this.entityName,
        idKey: this.idKey,
        service: this.service,
        updateLabel: this.updateLabel,
      } as BaseAddEditOptions,
    });
  }

  openEdit(entity: any): void {
    this.matDialog.open(BaseAddEditComponent, {
      data: {
        fieldsConfig: this.fieldsConfig,
        entityName: this.entityName,
        idKey: this.idKey,
        service: this.service,
        fields: this.updateFields,
        updateLabel: this.updateLabel,
        edit: entity,
      } as BaseAddEditOptions,
    });
  }

  delete(entity: CommonColumns): void {
    if (entity.deleting) return;
    this.matDialog
      .open(this.deleteTemplateRef)
      .afterClosed()
      .pipe(take(1), takeUntil(this._destroy$))
      .subscribe(del => {
        if (del) {
          this.loading = true;
          this.service
            .delete(entity.id)
            .pipe(
              tap(() => {
                this.matSnackBar.open(`${this.entityName} deleted successfully`, 'Close');
              }),
              catchHttpError(err => {
                if (err.status === 409) {
                  this.matSnackBar.open(`Can't delete because of relations`, 'Close');
                } else {
                  this.matSnackBar.open(`Internal Error`, 'Close');
                }
              }),
              finalize(() => {
                this.loading = false;
                this.changeDetectorRef.markForCheck();
              })
            )
            .subscribe();
        }
      });
  }

  fileUpload(entity: CommonColumns, $event: Event): void {
    if (entity.uploading) return;
    const file = ($event.target as HTMLInputElement).files[0];
    if (!file) return;
    this.service
      .uploadFile(entity[this.idKey], file)
      .pipe(
        tap(() => {
          this.matSnackBar.open(`Image uploaded successfully!`, 'Close');
        })
      )
      .subscribe();
  }

  seeImage(idImage: number): void {
    this.matDialog.open(this.imageTemplateRef, { data: idImage });
  }

  ngOnInit(): void {}

  ngOnChanges(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
