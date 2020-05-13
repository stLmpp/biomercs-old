import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Character } from '../../model/character';

export interface CharacterState extends EntityState<Character> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'character', cache: { ttl: 900_000 } })
export class CharacterStore extends EntityStore<CharacterState> {
  constructor() {
    super();
  }
}
