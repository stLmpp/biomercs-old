import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from '../../state/user/user.service';
import { distinctUntilChanged, filter, finalize, switchMap } from 'rxjs/operators';
import { trackByFactory } from '../../util/util';
import { User } from '../../model/user';
import { DialogService } from '../../shared/dialog/dialog.service';
import { AuthService } from '../../auth/state/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@ng-stack/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserRolesComponent } from './user-roles/user-roles.component';

interface SearchUserForm {
  username?: string;
  email?: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  constructor(
    private userService: UserService,
    private dialogService: DialogService,
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog
  ) {}

  search$ = new Subject<SearchUserForm>();

  form = new FormGroup<SearchUserForm>(
    {
      username: new FormControl(''),
      email: new FormControl(''),
    },
    { updateOn: 'blur' }
  );

  loading = false;

  trackBy = trackByFactory<User>('id');

  users$ = this.search$.pipe(
    distinctUntilChanged(),
    switchMap(({ username, email }) => {
      this.loading = true;
      return this.userService.search(username, email).pipe(
        finalize(() => {
          this.loading = false;
        })
      );
    })
  );

  search(): void {
    this.search$.next(this.form.value);
  }

  manageRoles(idUser: number): void {
    this.matDialog.open(UserRolesComponent, { data: idUser });
  }

  resetPassword(user: User): void {
    const http = this.authService.resetPassword(user.id);
    this.dialogService
      .confirm({
        title: `Reset password of ${user.username}`,
        content: `An e-mail will be send to ${user.email}`,
        observable: http,
      })
      .pipe(filter(confirm => confirm))
      .subscribe(() => {
        this.matSnackBar.open('Password reseted and e-mail sent', 'Close');
      });
  }

  ngOnInit(): void {}
}
