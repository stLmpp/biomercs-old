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
    private userFollowerQuery: UserFollowerQuery
  ) {
    super(http, userFollowerStore, userFollowerQuery, {
      endPoint: 'user-follower',
    });
  }
}
