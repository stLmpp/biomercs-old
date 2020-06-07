import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserQuery } from '../../../state/user/user.query';
import { Observable } from 'rxjs';
import { UserRoleService } from '../../../state/user-role/user-role.service';
import { finalize } from 'rxjs/operators';
import { User } from '../../../model/user';
import { Role, RoleEnum, trackByRole } from '../../../model/role';
import { RoleQuery } from '../../../state/role/role.query';
import { UserRole } from '../../../model/user-role';
import { Dictionary } from '../../../util/util';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRolesComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) private idUser: number,
    private userQuery: UserQuery,
    private userRoleService: UserRoleService,
    private changeDetectorRef: ChangeDetectorRef,
    public roleQuery: RoleQuery
  ) {}

  roleEnum = RoleEnum;

  user$: Observable<User>;

  trackByRole = trackByRole;

  loading = true;
  saving: Dictionary<boolean> = {};

  addOrDelete(role: Role, userRole?: UserRole): void {
    if (role.name === RoleEnum.user) return;
    let http$: Observable<UserRole | UserRole[]>;
    this.saving = { ...this.saving, [role.id]: true };
    if (!userRole) {
      http$ = this.userRoleService.add({
        idRole: role.id,
        idUser: this.idUser,
      });
    } else {
      http$ = this.userRoleService.delete(userRole.id);
    }
    http$
      .pipe(
        finalize(() => {
          this.saving = { ...this.saving, [role.id]: false };
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.user$ = this.userQuery.selectEntity(this.idUser);
    this.userRoleService
      .findByParams({ idUser: this.idUser })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }
}
