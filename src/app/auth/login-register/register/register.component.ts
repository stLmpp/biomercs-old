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
} from '@angular/forms';
import { AuthService } from '../../state/auth.service';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { catchHttpError } from '../../../util/operators/catchError';
import { Subject } from 'rxjs';
import { uniqueUsernameValidator } from '../../../validators/unique-username.directive';
import { uniqueEmailValidator } from '../../../validators/unique-email.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

const confirmPasswordValidator = (sibling: string): ValidatorFn => ({
  parent,
  value,
  pristine,
}) => {
  if (!value || pristine) return null;
  const password = parent.get(sibling).value;
  if (!!password && value !== password) {
    return { unequalPasswords: true };
  }
  return null;
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
    private router: Router
  ) {}

  private _destroy$ = new Subject();

  @ViewChild('successRef', { read: TemplateRef })
  successTemplateRef: TemplateRef<any>;

  form = new FormGroup({
    username: new FormControl(
      null,
      [Validators.required],
      [uniqueUsernameValidator(this.authService)]
    ),
    email: new FormControl(
      null,
      [Validators.required, Validators.email],
      [uniqueEmailValidator(this.authService)]
    ),
    password: new FormControl(null, [
      Validators.required,
      confirmPasswordValidator('confirmPassword'),
    ]),
    confirmPassword: new FormControl(null, [
      Validators.required,
      confirmPasswordValidator('password'),
    ]),
  });

  get usernameControl(): FormControl {
    return this.form.get('username') as FormControl;
  }

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

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
    this.passwordControl.valueChanges
      .pipe(takeUntil(this._destroy$), debounceTime(500))
      .subscribe(() => {
        this.confirmPasswordControl.updateValueAndValidity({
          emitEvent: false,
        });
        this.changeDetectorRef.markForCheck();
      });
    this.confirmPasswordControl.valueChanges
      .pipe(takeUntil(this._destroy$), debounceTime(500))
      .subscribe(() => {
        this.passwordControl.updateValueAndValidity({ emitEvent: false });
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
