import { Pipe, PipeTransform } from '@angular/core';
import { AuthQuery } from '../../auth/state/auth.query';
import { User } from '../../model/user';
import { isNumber } from 'is-what';

@Pipe({ name: 'isFollowing' })
export class IsFollowingPipe implements PipeTransform {
  constructor(private authQuery: AuthQuery) {}

  transform(user: User): boolean;
  transform(idUser: number): boolean;
  transform(value: User | number): boolean {
    return this.authQuery.isFollowing(isNumber(value) ? value : value?.id);
  }
}
