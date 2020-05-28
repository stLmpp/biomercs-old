import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ModeQuery } from '../../state/mode/mode.query';
import { ModeService } from '../../state/mode/mode.service';
import { Mode } from '../../model/mode';
import { FieldsConfig } from '../base/base.component';
import { Validators } from '@ng-stack/forms';

@Component({
  selector: 'app-mode',
  templateUrl: './mode.component.html',
  styleUrls: ['./mode.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModeComponent implements OnInit {
  constructor(public modeQuery: ModeQuery, public modeService: ModeService) {}

  fieldsConfig: FieldsConfig<Mode> = {
    name: {
      validators: [Validators.required],
    },
  };

  ngOnInit(): void {}
}
