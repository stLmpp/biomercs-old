import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLinkStore } from './user-link.store';
import { UserLinkQuery } from './user-link.query';
import {
  UserLink,
  UserLinkAddDto,
  UserLinkParamsDto,
  UserLinkUpdateDto,
} from '../../model/user-link';
import { SuperService } from '../../shared/super/super-service';

@Injectable({ providedIn: 'root' })
export class UserLinkService extends SuperService<
  UserLink,
  UserLinkAddDto,
  UserLinkUpdateDto,
  UserLinkParamsDto,
  UserLinkParamsDto
> {
  constructor(
    private userLinkStore: UserLinkStore,
    private http: HttpClient,
    private userLinkQuery: UserLinkQuery
  ) {
    super(http, userLinkStore, userLinkQuery, {
      endPoint: 'user-link',
      excludeMethods: ['findAll'],
    });
  }

  upsert(userLinks: UserLink[]): void {
    this.userLinkStore.upsert(userLinks);
  }
}
