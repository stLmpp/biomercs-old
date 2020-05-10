import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AuthStore } from './auth.store';
import { Auth, User } from '../../model/user';
import { map } from 'rxjs/operators';
import { RoleEnum } from '../../model/role';

@Injectable({ providedIn: 'root' })
export class AuthQuery extends Query<Auth> {
  constructor(protected store: AuthStore) {
    super(store);
  }

  isLogged$ = this.select(state => {
    return !!state?.user?.token;
  });

  user$ = this.select('user');

  isAdmin$ = this.user$.pipe(map(this.isAdmin));

  private isAdmin(user: User): boolean {
    return user?.userRoles?.some(
      userRole => userRole.role.name === RoleEnum.admin
    );
  }

  getIsAdmin(): boolean {
    return this.isAdmin(this.getUserSnapshot());
  }

  getTokenSnapshot(): string {
    return this.getValue().user?.token;
  }

  getUserSnapshot(): User {
    return this.getValue().user;
  }

  isLogged(): boolean {
    return !!this.getTokenSnapshot();
  }
}
