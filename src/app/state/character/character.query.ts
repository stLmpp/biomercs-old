import { Injectable } from '@angular/core';
import { Character } from '../../model/character';
import { CharacterStore } from './character.store';
import { EntityQuery } from '@stlmpp/store';
import { orderByOperator } from '@stlmpp/utils';

@Injectable({ providedIn: 'root' })
export class CharacterQuery extends EntityQuery<Character> {
  constructor(private characterStore: CharacterStore) {
    super(characterStore);
  }

  all$ = this.all$.pipe(orderByOperator('order'));
}
