import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../model/user';
import { AuthQuery } from '../../auth/state/auth.query';
import { isNumber } from 'is-what';

@Pipe({ name: 'isSameAsLogged' })
export class IsSameAsLoggedPipe implements PipeTransform {
  constructor(private authQuery: AuthQuery) {}

  transform(idUser: number): boolean;
  transform(user: User): boolean;
  transform(value: number | User): boolean {
    return this.authQuery.isSameAsLogged(isNumber(value) ? value : value?.id);
  }
}
