import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, ValidatorFn } from '@ng-stack/forms';
import { startCase } from '../../../shared/pipes/start-case.pipe';
import { trackByFactory } from '@stlmpp/utils';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { SuperService } from '../../../shared/super/super-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonColumns } from '../../../model/common-history';
import { CurrencyMaskConfig } from 'ngx-currency';

export interface FieldConfig<S = any> {
  type?: 'text' | 'number' | 'select' | 'checkbox';
  currencyOptions?: Partial<CurrencyMaskConfig>;
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

export type FieldsConfig<T = any, S = any, K extends keyof T = keyof T> = { [P in K]?: FieldConfig<S> };
export const DEFAULT_VALIDATORS_MESSAGES: { [key: string]: string } = {
  required: '{field} is required',
};

export interface BaseAddEditOptions<T = any> {
  edit?: T;
  fields: string[];
  updateLabel: string | string[];
  entityName: string;
  service: SuperService<any>;
  idKey?: string;
  fieldsConfig: FieldsConfig<T>;
  order?: number;
}

@Component({
  selector: 'app-base-add-edit',
  templateUrl: './base-add-edit.component.html',
  styleUrls: ['./base-add-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseAddEditComponent<T extends CommonColumns = any> implements OnInit {
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private matSnackBar: MatSnackBar,
    private matDialogRef: MatDialogRef<BaseAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: BaseAddEditOptions<T>
  ) {
    Object.assign(this, data);
    this._fieldsConfig = data.fieldsConfig;
  }

  @Input() edit: T;
  @Input() fields: string[] = [];
  @Input() updateLabel: string;
  @Input() entityName: string;
  @Input() service: SuperService<any>;
  @Input() idKey = 'id';
  @Input() order: number;

  trackByLabel = trackByFactory<string>();
  loading = false;

  @Input('fieldsConfig')
  set _fieldsConfig(config: FieldsConfig<T>) {
    this.fieldsConfig = this.fields.reduce((acc, key) => {
      return {
        ...acc,
        [key]: {
          ...{
            type: 'text',
            placeholder: startCase(key),
            selectTrackBy: trackByFactory('id'),
            currencyOptions: {
              precision: 0,
              align: 'left',
              allowNegative: false,
            },
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

  form: FormGroup;

  save(entity?: any): void {
    this.loading = true;
    const id = entity?.[this.idKey];
    const http: Observable<any> = id
      ? this.service.update(id, this.form.getDirtyValues())
      : this.service.add(this.order ? { ...this.form.value, order: this.order } : this.form.value);
    this.form.disable({ emitEvent: false });
    this.matDialogRef.disableClose = true;
    http
      .pipe(
        tap(() => {
          this.matSnackBar.open(`${this.entityName} saved successfully`, 'Close');
        }),
        finalize(() => {
          this.loading = false;
          this.matDialogRef.close();
          this.form.enable({ emitEvent: false });
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }

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

  ngOnInit(): void {
    if (!this.fieldsConfig) {
      this._fieldsConfig = {};
    }
    if (this.fields.length === 1 && !this.updateLabel) {
      this.updateLabel = this.fields[0];
    }
    this.form = this.setForm(this.fields, this.edit);
  }
}
