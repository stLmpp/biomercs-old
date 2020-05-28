import { Injectable } from '@angular/core';
import { UserStore } from './user.store';
import { UserShowcase, UsershowcaseUpdateDto } from '../../model/user-showcase';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class UserShowcaseService {
  constructor(
    private userStore: UserStore,
    private http: HttpClient,
    private userService: UserService
  ) {}

  endPoint = 'user-showcase';

  update(
    idUser: number,
    idUserShowcase: number,
    dto: UsershowcaseUpdateDto
  ): Observable<UserShowcase> {
    return this.http
      .patch<UserShowcase>(`${this.endPoint}/${idUserShowcase}`, dto)
      .pipe(
        tap(userShowcase => {
          this.userStore.update(idUser, { userShowcase });
        })
      );
  }

  findByIdUser(idUser: number): Observable<UserShowcase> {
    return this.http
      .get<UserShowcase>(`${this.userService.endPoint}/${idUser}/user-showcase`)
      .pipe(
        tap(userShowcase => {
          this.userStore.update(idUser, { userShowcase });
        })
      );
  }
}
