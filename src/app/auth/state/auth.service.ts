import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthStore } from './auth.store';
import { catchError, tap } from 'rxjs/operators';
import { User, UserRegisterDto, UserRegisterResponse } from '../../model/user';
import { Observable, of, throwError } from 'rxjs';
import { AuthQuery } from './auth.query';
import { setLoading } from '@datorama/akita';
import { HttpParams } from '../../util/http-params';
import { catchHttpError } from '../../util/operators/catchError';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private authStore: AuthStore,
    private http: HttpClient,
    private authQuery: AuthQuery
  ) {}

  private target = '/auth';
  private targetUser = '/user';

  autoLogin(): Observable<User> {
    const userLocal = this.authQuery.getUserSnapshot();
    if (!userLocal?.token || !!userLocal?.id) {
      return of(null);
    }
    return this.http.post<User>(`${this.target}/auto-login`, undefined).pipe(
      setLoading(this.authStore),

      tap(user => {
        this.authStore.update({ user });
      }),
      // @ts-ignore
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
      .post<User>(`${this.target}/login`, { username, password, rememberMe })
      .pipe(
        setLoading(this.authStore),
        tap(user => {
          this.authStore.update({ user });
        }),
        catchError(error => {
          this.authStore.setError(error.error);
          return throwError(error);
        })
      );
  }

  logout(): void {
    this.authStore.update({ user: null });
  }

  register(dto: UserRegisterDto): Observable<UserRegisterResponse> {
    return this.http.post<UserRegisterResponse>(`${this.target}/register`, dto);
  }

  existsByEmail(email: string): Observable<boolean> {
    const params = new HttpParams({ email });
    return this.http.get<boolean>(`${this.targetUser}/exists/email`, {
      params,
    });
  }

  existsByUsername(username: string): Observable<boolean> {
    const params = new HttpParams({ username });
    return this.http.get<boolean>(`${this.targetUser}/exists/username`, {
      params,
    });
  }
}
