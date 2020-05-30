import { EntityStore } from '@stlmpp/store';
import { Injectable } from '@angular/core';
import { Score } from '../../model/score';

@Injectable({ providedIn: 'root' })
export class ScoreStore extends EntityStore<Score> {
  constructor() {
    super({ name: 'score' });
  }
}
