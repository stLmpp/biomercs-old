import { Injectable } from '@angular/core';
import { AuthStore } from './auth.store';
import { Auth, User } from '../../model/user';
import { filter, map } from 'rxjs/operators';
import { RoleEnum } from '../../model/role';
import { Observable } from 'rxjs';
import { Query } from '@stlmpp/store';

@Injectable({ providedIn: 'root' })
export class AuthQuery extends Query<Auth> {
  constructor(protected authStore: AuthStore) {
    super(authStore);
  }

  isLogged$ = this.select(state => {
    return !!state?.user?.token;
  });
  user$ = this.select('user').pipe(filter(user => !!user));
  isAdmin$ = this.user$.pipe(map(this.isAdmin));
  isOwner$ = this.user$.pipe(map(this.isOwner));

  hasRoles(roles: RoleEnum[]): boolean {
    return this.getUserSnapshot()?.userRoles.some(userRole =>
      roles.includes(userRole.role.name)
    );
  }

  isSameAsLogged$(idUser: number): Observable<boolean> {
    return this.user$.pipe(
      filter(user => !!user),
      map(user => user.id === idUser)
    );
  }

  isSameAsLogged(idUser: number): boolean {
    return this.getUserSnapshot()?.id === idUser;
  }

  isFollowing(idUser: number): boolean {
    const authUser = this.getUserSnapshot();
    return (
      authUser?.id !== idUser &&
      authUser?.userFollowed?.some(followed => followed.idFollowed === idUser)
    );
  }

  private isAdmin(user: User): boolean {
    return user?.userRoles?.some(
      userRole => userRole.role.name === RoleEnum.admin
    );
  }

  private isOwner(user: User): boolean {
    return user?.userRoles?.some(
      userRole => userRole.role.name === RoleEnum.owner
    );
  }

  getIsOwner(): boolean {
    return this.isOwner(this.getUserSnapshot());
  }

  getIsAdmin(): boolean {
    return this.isAdmin(this.getUserSnapshot());
  }

  getTokenSnapshot(): string {
    return this.getState().user?.token;
  }

  getUserSnapshot(): User {
    return this.getState().user;
  }

  isLogged(): boolean {
    return /*!environment.production || */ !!this.getTokenSnapshot();
  }
}
