import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TypeQuery } from '../../state/type/type.query';
import { TypeService } from '../../state/type/type.service';
import { FieldsConfig } from '../base/base.component';
import { Type } from '../../model/type';
import { Validators } from '@ng-stack/forms';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeComponent implements OnInit {
  constructor(public typeQuery: TypeQuery, public typeService: TypeService) {}

  fieldsConfig: FieldsConfig<Type> = {
    name: {
      validators: [Validators.required],
    },
    playerQuantity: {
      validators: [Validators.required],
      type: 'number',
    },
  };

  ngOnInit(): void {}
}
