import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthStore } from './auth.store';
import { catchError, delay, tap } from 'rxjs/operators';
import { User } from '../../model/user';
import { Observable, of, throwError } from 'rxjs';
import { AuthQuery } from './auth.query';
import { setLoading } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private authStore: AuthStore,
    private http: HttpClient,
    private authQuery: AuthQuery
  ) {}

  autoLogin(): Observable<User> {
    const userLocal = this.authQuery.getUserSnapshot();
    if (!userLocal?.token || !!userLocal?.id) return of(null);
    return this.http.post<User>('/auth/auto-login', undefined).pipe(
      setLoading(this.authStore),
      tap((user) => {
        this.authStore.update({ user });
      })
    );
  }

  loginApi(username: string, password: string): Observable<User> {
    return this.http
      .post<User>('/auth/login', { username, password })
      .pipe(
        setLoading(this.authStore),
        tap((user) => {
          this.authStore.update({ user });
        }),
        catchError((error) => {
          this.authStore.setError(error.error);
          return throwError(error);
        })
      );
  }

  logout(): void {
    this.authStore.update({ user: null });
  }
}
