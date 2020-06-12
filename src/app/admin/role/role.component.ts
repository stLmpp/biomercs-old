import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RoleQuery } from '../../state/role/role.query';
import { RoleService } from '../../state/role/role.service';
import { Role } from '../../model/role';
import { Validators } from '@ng-stack/forms';
import { FieldsConfig } from '../base/base-add-edit/base-add-edit.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleComponent implements OnInit {
  constructor(public roleQuery: RoleQuery, public roleService: RoleService) {}

  fieldsConfig: FieldsConfig<Role> = {
    description: {
      validators: [Validators.required],
    },
  };

  ngOnInit(): void {}
}
