import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidatorsModel,
} from '@ng-stack/forms';
import {
  confirmPasswordValidator,
  watchPasswords,
} from '../register/register.component';
import { interval, Subject } from 'rxjs';
import { UserQuery } from '../../../state/user/user.query';
import { RouterQuery } from '@stlmpp/router';
import { RouteParamEnum } from '../../../model/route-param.enum';
import { AuthService } from '../../state/auth.service';
import { User } from '../../../model/user';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { catchHttpError } from '../../../util/operators/catchError';
import { ActivatedRoute, Router } from '@angular/router';

interface ResetPasswordForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordValidator extends ValidatorsModel {
  unequalPasswords: boolean;
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private userQuery: UserQuery,
    private routerQuery: RouterQuery,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  private _destroy$ = new Subject();

  loading = false;
  hide = true;
  user: User;
  err: string;
  msg: string;
  time = 5;

  form = new FormGroup<ResetPasswordForm>({
    username: new FormControl({ value: null, disabled: true }),
    email: new FormControl({ value: null, disabled: true }),
    password: new FormControl<string, PasswordValidator>(null, [
      Validators.required,
      Validators.minLength(4),
      confirmPasswordValidator('confirmPassword'),
    ]),
    confirmPassword: new FormControl<string, PasswordValidator>(null, [
      Validators.required,
      Validators.minLength(4),
      confirmPasswordValidator('password'),
    ]),
  });

  get passwordControl(): FormControl<string, PasswordValidator> {
    return this.form.get('password');
  }

  get confirmPasswordControl(): FormControl<string, PasswordValidator> {
    return this.form.get('confirmPassword');
  }

  confirm(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    const password = this.passwordControl.value;
    this.form.disable();
    this.authService
      .changePassword(
        this.user.id,
        password,
        this.routerQuery.getQueryParams(RouteParamEnum.token)
      )
      .pipe(
        catchHttpError(err => {
          this.form.enable();
          if (err.status === 409) {
            this.err = err.message;
          } else {
            this.err = 'Internal error';
          }
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(() => {
        this.msg = 'Password changed!';
        this.changeDetectorRef.markForCheck();
        interval(1000)
          .pipe(takeWhile(time => time <= 5))
          .subscribe(time => {
            this.time--;
            this.changeDetectorRef.markForCheck();
            if (this.time === 0) {
              this.navigateToLogin();
            }
          });
      });
  }

  navigateToLogin(): void {
    this.router.navigate(['../../', 'login'], {
      relativeTo: this.activatedRoute,
      queryParams: { [RouteParamEnum.username]: this.user.username },
    });
  }

  ngOnInit(): void {
    watchPasswords(
      this.passwordControl,
      this.confirmPasswordControl,
      this._destroy$,
      this.changeDetectorRef
    );
    this.form.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.err = null;
    });
    this.user = this.userQuery.getEntity(
      +this.routerQuery.getParams(RouteParamEnum.idUser)
    );
    this.form.patchValue({
      username: this.user.username,
      email: this.user.email,
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
