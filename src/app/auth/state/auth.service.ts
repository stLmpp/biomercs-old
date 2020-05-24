import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthStore } from './auth.store';
import { tap } from 'rxjs/operators';
import {
  User,
  UserForgotPasswordDto,
  UserRegisterDto,
  UserRegisterResponse,
} from '../../model/user';
import { Observable, of } from 'rxjs';
import { AuthQuery } from './auth.query';
import { catchHttpError } from '../../util/operators/catchError';
import { Params } from '@angular/router';
import { setError, setLoading } from '@stlmpp/store';
import { UserService } from '../../state/user/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private authStore: AuthStore,
    private http: HttpClient,
    private authQuery: AuthQuery,
    private userService: UserService
  ) {}

  endPoint = '/auth';

  autoLogin(): Observable<User> {
    const userLocal = this.authQuery.getUserSnapshot();
    if (!userLocal?.token || !!userLocal?.id) {
      return of(null);
    }
    return this.http.post<User>(`${this.endPoint}/auto-login`, undefined).pipe(
      setLoading(this.authStore),
      tap(user => {
        this.authStore.update({ user });
        this.userService.upsert(user);
      }),
      catchHttpError(() => {
        this.authStore.update({ user: null });
        return of(null);
      })
    );
  }

  loginApi(
    username: string,
    password: string,
    rememberMe = false
  ): Observable<User> {
    return this.http
      .post<User>(`${this.endPoint}/login`, { username, password, rememberMe })
      .pipe(
        setLoading(this.authStore),
        setError(this.authStore),
        tap(user => {
          this.authStore.update({ user });
        })
      );
  }

  logout(): void {
    this.authStore.update({ user: null });
  }

  register(dto: UserRegisterDto): Observable<UserRegisterResponse> {
    return this.http.post<UserRegisterResponse>(
      `${this.endPoint}/register`,
      dto
    );
  }

  forgotPassword(dto: UserForgotPasswordDto): Observable<string> {
    return this.http.post<string>(`${this.endPoint}/forgot-password`, dto, {
      responseType: 'text' as any,
    });
  }

  confirmForgotPassword(idUser: number, token: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.endPoint}/confirm-forgot-password`, {
      idUser,
      token,
    });
  }

  changePassword(
    idUser: number,
    newPassword: number,
    token?: string
  ): Observable<User> {
    const params: Params = {};
    let url = `${this.endPoint}/change-password/${idUser}`;
    if (token) {
      params.token = token;
      url += '/token';
    }
    return this.http
      .post<User>(url, { password: newPassword }, { params })
      .pipe(
        tap(user => {
          this.authStore.update({ user });
        })
      );
  }

  resetPassword(idUser: number): Observable<void> {
    return this.http.post<void>(
      `${this.endPoint}/reset-password/${idUser}`,
      undefined
    );
  }
}
