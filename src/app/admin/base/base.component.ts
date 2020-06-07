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
import { convertToBoolProperty, trackByFactory } from '../../util/util';
import { AsyncValidatorFn, FormControl, FormGroup, ValidatorFn } from '@ng-stack/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { debounceTime, finalize, take, takeUntil, tap } from 'rxjs/operators';
import { CommonColumns } from '../../model/common-history';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchHttpError } from '../../util/operators/catchError';
import { startCase } from '../../shared/start-case/start-case.pipe';
import { SuperService } from '../../shared/super/super-service';

export interface FieldConfig<S = any> {
  type?: 'text' | 'number' | 'select' | 'checkbox';
  placeholder?: string;
  validators?: ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[];
  validatorsMessages?: { [key: string]: string };
  asyncValidatorsMessage?: { [key: string]: string };
  selectOptions?: Observable<S[]>;
  selectLabel?: keyof S;
  selectValue?: keyof S;
  selectTrackBy?: TrackByFunction<S>;
  hint?: string;
}

export type FieldsConfig<T = any, S = any> = Partial<Record<keyof T, FieldConfig<S>>>;

const DEFAULT_VALIDATORS_MESSAGES: { [key: string]: string } = {
  required: '{field} is required',
};

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

  @ViewChild('modalRef', { read: TemplateRef }) modalTemplateRef: TemplateRef<any>;
  @ViewChild('deleteRef', { read: TemplateRef }) deleteTemplateRef: TemplateRef<any>;
  @ViewChild('imageRef', { read: TemplateRef }) imageTemplateRef: TemplateRef<any>;

  addRef: MatDialogRef<any>;
  editRef: MatDialogRef<any>;

  loading = false;

  trackByLabel = trackByFactory<string>();
  addForm: FormGroup;
  editForm: FormGroup;

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

  @Input('fieldsConfig')
  set _fieldsConfig(config: FieldsConfig) {
    this.fieldsConfig = [...new Set([...this.addFields, ...this.updateFields])].reduce((acc, key) => {
      return {
        ...acc,
        [key]: {
          ...{
            type: 'text',
            placeholder: startCase(key),
            selectTrackBy: trackByFactory('id'),
          },
          ...(config?.[key] ?? {}),
          validatorsMessages: {
            ...DEFAULT_VALIDATORS_MESSAGES,
            ...(config?.[key]?.validatorsMessages ?? {}),
          },
        },
      };
    }, {});
  }
  fieldsConfig: FieldsConfig;

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
    this.addRef = this.matDialog.open(this.modalTemplateRef);
    this.addRef
      .afterClosed()
      .pipe(take(1), takeUntil(this._destroy$))
      .subscribe(() => {
        this.addForm = this.setForm(this.addFields);
      });
  }

  openEdit(entity: any): void {
    this.editForm = this.setForm(this.updateFields, entity);
    this.editRef = this.matDialog.open(this.modalTemplateRef, { data: entity });
  }

  save(entity?: any): void {
    this.loading = true;
    const id = entity?.[this.idKey];
    const http: Observable<any> = id
      ? this.service.update(id, this.editForm.getDirtyValues())
      : this.service.add(this.addForm.value);
    const form = this[id ? 'editForm' : 'addForm'];
    form.disable({ emitEvent: false });
    const modalRef = this[id ? 'editRef' : 'addRef'];
    modalRef.disableClose = true;
    http
      .pipe(
        tap(() => {
          this.matSnackBar.open(`${this.entityName} saved successfully`, 'Close');
        }),
        finalize(() => {
          this.loading = false;
          modalRef.close();
          form.enable({ emitEvent: false });
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
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

  ngOnInit(): void {
    if (!this.fieldsConfig) {
      this._fieldsConfig = {};
    }
    if (this.updateFields.length === 1) {
      this.updateLabel = this.updateFields[0];
    }
    this.addForm = this.setForm(this.addFields);
  }

  ngOnChanges(): void {
    this._fieldsConfig = this.fieldsConfig;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
