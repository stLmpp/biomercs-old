import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PlatformQuery } from '../../state/platform/platform.query';
import { PlatformService } from '../../state/platform/platform.service';
import { Platform, PlatformTypeEnum } from '../../model/platform';
import { Validators } from '@ng-stack/forms';
import { LabelValue, trackByValue } from '../../model/label-value';
import { of } from 'rxjs';
import { FieldsConfig } from '../base/base-add-edit/base-add-edit.component';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.component.html',
  styleUrls: ['./platform.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformComponent implements OnInit {
  constructor(public platformQuery: PlatformQuery, public platformService: PlatformService) {}

  fieldsConfig: FieldsConfig<Platform, LabelValue> = {
    name: {
      validators: [Validators.required],
    },
    shortName: {
      validators: [Validators.required],
    },
    type: {
      validators: [Validators.required],
      type: 'select',
      selectTrackBy: trackByValue,
      selectValue: 'value',
      selectLabel: 'label',
      selectOptions: of(
        Object.entries(PlatformTypeEnum).map(([value, label]) => ({
          label,
          value,
        }))
      ),
    },
  };

  ngOnInit(): void {}
}
