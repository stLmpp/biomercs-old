import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../state/auth.service';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { HttpError, HttpErrorResponse } from '../../../model/http-error';
import { Subject, throwError } from 'rxjs';
import { catchHttpError } from '../../../util/operators/catchError';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  private _destroy$ = new Subject();

  form = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    rememberMe: new FormControl(false),
  });

  logging = false;

  login(): void {
    if (this.form.invalid) return;
    this.logging = true;
    const { username, password, rememberMe } = this.form.value;
    this.form.disable();
    this.authService
      .loginApi(username, password, !!rememberMe)
      .pipe(
        finalize(() => {
          this.logging = false;
          this.form.enable();
          this.changeDetectorRef.markForCheck();
        }),
        catchHttpError(err => {
          this.form.setErrors({ loginError: true });
          return throwError(err);
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this.form.setErrors(null));
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
