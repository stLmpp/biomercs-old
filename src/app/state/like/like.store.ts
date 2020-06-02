import { EntityStore } from '@stlmpp/store';
import { Like } from '../../model/like';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LikeStore extends EntityStore<Like> {
  constructor() {
    super({ name: 'like' });
  }
}
