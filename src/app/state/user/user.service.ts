import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserStore } from './user.store';
import { Observable } from 'rxjs';
import { User, UserUpdateDto } from '../../model/user';
import { tap } from 'rxjs/operators';
import { UpdateResult } from '../../model/update-result';
import { HttpParams } from '../../util/http-params';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private userStore: UserStore, private http: HttpClient) {}

  endPoint = 'user';

  findById(id: number): Observable<User> {
    return this.http.get<User>(`${this.endPoint}/${id}`).pipe(
      tap(user => {
        this.userStore.upsert(id, user);
      })
    );
  }

  update(id: number, dto: UserUpdateDto): Observable<UpdateResult> {
    return this.http.patch<UpdateResult>(`${this.endPoint}/${id}`, dto).pipe(
      tap(() => {
        this.userStore.update(id, dto);
      })
    );
  }

  existsByEmail(email: string): Observable<boolean> {
    const params = new HttpParams({ email });
    return this.http.get<boolean>(`${this.endPoint}/exists/email`, {
      params,
    });
  }

  existsByUsername(username: string): Observable<boolean> {
    const params = new HttpParams({ username });
    return this.http.get<boolean>(`${this.endPoint}/exists/username`, {
      params,
    });
  }

  search(username: string, email: string): Observable<User[]> {
    const params = new HttpParams({ username, email }, true);
    return this.http
      .get<User[]>(`${this.endPoint}/search`, { params })
      .pipe(
        tap(users => {
          this.userStore.upsertMany(users);
        })
      );
  }
}
