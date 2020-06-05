import { Injectable } from '@angular/core';
import { EntityQuery } from '@stlmpp/store';
import { Like, LikeParamsDto } from '../../model/like';
import { LikeStore } from './like.store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { isEqual } from 'underscore';

@Injectable({ providedIn: 'root' })
export class LikeQuery extends EntityQuery<Like> {
  constructor(private likeStore: LikeStore) {
    super(likeStore);
  }

  findOneByParams(dto: LikeParamsDto): Observable<Like> {
    return this.all$.pipe(
      map(likes =>
        likes.find(like =>
          Object.entries(dto).every(([key, value]) => like[key] === value)
        )
      ),
      distinctUntilChanged(isEqual)
    );
  }
}
