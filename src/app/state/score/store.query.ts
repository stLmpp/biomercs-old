import { Injectable } from '@angular/core';
import { EntityQuery } from '@stlmpp/store';
import { ScoreStore } from './score.store';
import { Score } from '../../model/score';

@Injectable({ providedIn: 'root' })
export class ScoreQuery extends EntityQuery<Score> {
  constructor(private scoreStore: ScoreStore) {
    super(scoreStore);
  }
}
