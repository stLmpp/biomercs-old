import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserFollowerStore } from './user-follower.store';
import { UserFollowerQuery } from './user-follower.query';
import {
  UserFollower,
  UserFollowerAddDto,
  UserFollowerExistsDto,
} from '../../model/user-follower';
import { SuperService } from '../../shared/super/super-service';
import { Observable } from 'rxjs';
import { User } from '../../model/user';
import { AuthQuery } from '../../auth/state/auth.query';

@Injectable({ providedIn: 'root' })
export class UserFollowerService extends SuperService<
  UserFollower,
  UserFollowerAddDto,
  any,
  UserFollowerExistsDto,
  UserFollowerExistsDto,
  UserFollowerAddDto
> {
  constructor(
    private userFollowerStore: UserFollowerStore,
    private http: HttpClient,
    private userFollowerQuery: UserFollowerQuery,
    private authQuery: AuthQuery
  ) {
    super(http, userFollowerStore, userFollowerQuery, {
      endPoint: 'user-follower',
    });
  }

  followUnfollow(user: User): Observable<UserFollower | UserFollower[]> {
    const follow = !this.authQuery.isFollowing(user.id);
    const dto: UserFollowerAddDto = {
      idFollowed: user.id,
      idFollower: this.authQuery.getUserSnapshot().id,
    };
    return follow ? this.add(dto) : this.deleteByParams(dto);
  }

  upsert(userFollowers: UserFollower[]): void {
    this.userFollowerStore.upsert(userFollowers);
  }
}
