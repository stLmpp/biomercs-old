import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../state/auth.service';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { catchHttpError } from '../../../util/operators/catchError';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { RouteParamEnum } from '../../../model/route-param.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private matSnackBar: MatSnackBar,
    private router: Router,
    private routerQuery: RouterQuery,
    private activatedRoute: ActivatedRoute
  ) {}

  private _destroy$ = new Subject();

  form = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    rememberMe: new FormControl(false),
  });

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  get usernameControl(): FormControl {
    return this.form.get('username') as FormControl;
  }

  login(): void {
    if (this.form.invalid) return;
    const { username, password, rememberMe } = this.form.value;
    this.form.disable();
    this.authService
      .loginApi(username, password, !!rememberMe)
      .pipe(
        tap(user => {
          if (user.expired && user.resetToken) {
            this.router.navigate(['../', 'reset-password', user.id], {
              relativeTo: this.activatedRoute,
              queryParams: {
                [RouteParamEnum.token]: user.resetToken,
              },
            });
          } else {
            this.router.navigate(['/']).then(() => {
              this.matSnackBar.open('Login successful!', 'Close');
            });
          }
        }),
        catchHttpError(err => {
          this.form.enable();
          this.form.get('password').setErrors({ loginError: err.message });
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    const username = this.routerQuery.getQueryParams(RouteParamEnum.username);
    if (username) {
      this.form.patchValue({ username });
    }
    this.form.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        filter(() => this.passwordControl.hasError('loginError'))
      )
      .subscribe(() => {
        this.passwordControl.setErrors(null);
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
