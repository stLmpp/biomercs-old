import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserFollowerStore } from './user-follower.store';
import { UserFollowerQuery } from './user-follower.query';
import { SuperService } from '../../shared/super/super-service';
import {
  UserFollower,
  UserFollowerAddDto,
  UserFollowerExistsDto,
} from '../../model/user-follower';
import { UserService } from '../user/user.service';

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
    private userService: UserService
  ) {
    super(http, userFollowerStore, userFollowerQuery, {
      endPoint: 'user-follower',
      afterDelete: result => {
        this.userService.removeFollowersAndFollowing(
          result.map(userFollower => userFollower.id)
        );
      },
    });
  }
}
