import { Injectable } from '@angular/core';
import { EntityQuery } from '@stlmpp/store';
import { Like } from '../../model/like';
import { LikeStore } from './like.store';

@Injectable({ providedIn: 'root' })
export class LikeQuery extends EntityQuery<Like> {
  constructor(private likeStore: LikeStore) {
    super(likeStore);
  }
}
