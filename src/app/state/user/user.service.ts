import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserStore } from './user.store';
import { Observable } from 'rxjs';
import { User, UserUpdateDto } from '../../model/user';
import { finalize, tap } from 'rxjs/operators';
import { UpdateResult } from '../../model/update-result';
import { HttpParams } from '../../util/http-params';
import { FileUpload } from '../../model/file-upload';
import { UserQuery } from './user.query';
import { arrayRemove } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private userStore: UserStore,
    private http: HttpClient,
    private userQuery: UserQuery
  ) {}

  endPoint = 'user';

  findById(id: number): Observable<User> {
    return this.http.get<User>(`${this.endPoint}/${id}`).pipe(
      tap(user => {
        this.userStore.upsert(id, user);
      })
    );
  }

  update(id: number, dto: UserUpdateDto): Observable<UpdateResult> {
    this.userStore.update(id, { saving: true });
    return this.http.patch<UpdateResult>(`${this.endPoint}/${id}`, dto).pipe(
      tap(() => {
        this.userStore.update(id, dto);
      }),
      finalize(() => {
        this.userStore.update(id, { saving: false });
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
          this.userStore.upsert(users);
        })
      );
  }

  uploadAvatar(idUser: number, file: File): Observable<FileUpload> {
    this.userStore.update(idUser, { uploading: true });
    const formData = new FormData();
    formData.append('file', file, file.name);
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    return this.http
      .patch<FileUpload>(`${this.endPoint}/${idUser}/avatar`, formData, {
        headers,
      })
      .pipe(
        tap(avatar => {
          this.userStore.update(idUser, { idAvatar: avatar.id, avatar });
        }),
        finalize(() => {
          this.userStore.update(idUser, { uploading: false });
        })
      );
  }
}
