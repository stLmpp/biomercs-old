import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@ng-stack/forms';
import { AuthService } from '../../state/auth.service';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { catchHttpError } from '../../../util/operators/catchError';
import { Subject } from 'rxjs';
import { uniqueUsernameValidator } from '../../../validators/unique-username.directive';
import { uniqueEmailValidator } from '../../../validators/unique-email.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../../../state/user/user.service';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const confirmPasswordValidator = (sibling: string): ValidatorFn => ({
  parent,
  value,
  pristine,
}) => {
  if (!value || pristine) return null;
  const password = parent.get(sibling).value;
  if (value !== password) {
    return { unequalPasswords: true };
  }
  return null;
};

export const watchPasswords = (
  control1: FormControl,
  control2: FormControl,
  destroy: Subject<any>,
  changeDetectorRef: ChangeDetectorRef
) => {
  control1.valueChanges
    .pipe(takeUntil(destroy), debounceTime(500))
    .subscribe(() => {
      control2.updateValueAndValidity({
        emitEvent: false,
      });
      changeDetectorRef.markForCheck();
    });
  control2.valueChanges
    .pipe(takeUntil(destroy), debounceTime(500))
    .subscribe(() => {
      control1.updateValueAndValidity({ emitEvent: false });
      changeDetectorRef.markForCheck();
    });
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private matSnackBar: MatSnackBar,
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private userService: UserService
  ) {}

  private _destroy$ = new Subject();

  hide = true;
  hideConfirm = true;

  @ViewChild('successRef', { read: TemplateRef })
  successTemplateRef: TemplateRef<any>;

  form = new FormGroup<RegisterForm>({
    username: new FormControl(
      null,
      [Validators.required],
      [uniqueUsernameValidator(this.userService)]
    ),
    email: new FormControl(
      null,
      [Validators.required, Validators.email],
      [uniqueEmailValidator(this.userService)]
    ),
    password: new FormControl(null, [
      Validators.required,
      confirmPasswordValidator('confirmPassword'),
      Validators.minLength(4),
    ]),
    confirmPassword: new FormControl(null, [
      Validators.required,
      confirmPasswordValidator('password'),
      Validators.minLength(4),
    ]),
  });

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }

  register(): void {
    if (this.form.invalid || this.form.pending) return;
    const dto = this.form.value;
    this.form.disable();
    this.authService
      .register(dto)
      .pipe(
        tap(response => {
          this.router.navigate(['/']).then(() => {
            this.matDialog.open(this.successTemplateRef, {
              data: response.email,
            });
          });
        }),
        catchHttpError(err => {
          this.form.enable();
          this.matSnackBar.open(err.message, 'Close');
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    watchPasswords(
      this.passwordControl,
      this.confirmPasswordControl,
      this._destroy$,
      this.changeDetectorRef
    );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
