import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { User } from '../../../../model/user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@ng-stack/forms';
import { UserService } from '../../../../state/user/user.service';
import { uniqueEmailValidator } from '../../../../validators/unique-email.directive';
import {
  confirmPasswordValidator,
  watchPasswords,
} from '../../../../auth/login-register/register/register.component';
import { forkJoin, Observable, of, Subject } from 'rxjs';
import { AuthService } from '../../../../auth/state/auth.service';
import { isAllNull, removeNullObject } from '../../../../util/util';
import { finalize, tap } from 'rxjs/operators';
import { catchHttpError } from '../../../../util/operators/catchError';
import { MatSnackBar } from '@angular/material/snack-bar';

interface UserUpdateForm {
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditInfoComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(MAT_DIALOG_DATA) public user: User,
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    private matDialogRef: MatDialogRef<EditInfoComponent>,
    private matSnackBar: MatSnackBar
  ) {}

  private _destroy$ = new Subject();

  hide = true;
  hideConfirm = true;

  saving = false;

  form: FormGroup<UserUpdateForm>;

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.matDialogRef.disableClose = true;
    const { confirmPassword, password, ...dto } = removeNullObject(
      this.form.value
    );
    let password$: Observable<User> = of(null);
    let update$: Observable<User> = of(null);
    if (confirmPassword && password && confirmPassword === password) {
      password$ = this.authService.changePassword(this.user.id, password);
    }
    if (!isAllNull(dto)) {
      update$ = this.userService.update(this.user.id, dto);
    }
    forkJoin([password$, update$])
      .pipe(
        finalize(() => {
          this.saving = false;
          this.changeDetectorRef.markForCheck();
        }),
        catchHttpError(err => {
          this.matSnackBar.open(
            err?.message ?? `Couldn't save, please try again later`,
            'Close'
          );
          this.matDialogRef.disableClose = false;
        }),
        tap(() => {
          this.matDialogRef.close();
          this.matSnackBar.open('Updated successfully', 'Close');
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(
        this.user.email,
        [Validators.required, Validators.email],
        [uniqueEmailValidator(this.userService, this.user.id)]
      ),
      password: new FormControl(null, [
        confirmPasswordValidator('confirmPassword'),
        Validators.minLength(4),
      ]),
      confirmPassword: new FormControl(null, [
        confirmPasswordValidator('password'),
        Validators.minLength(4),
      ]),
    });
    watchPasswords(
      this.form.get('password'),
      this.form.get('confirmPassword'),
      this._destroy$,
      this.changeDetectorRef
    );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
