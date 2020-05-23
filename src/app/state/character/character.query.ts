import { Injectable } from '@angular/core';
import { Character } from '../../model/character';
import { CharacterStore } from './character.store';
import { EntityQuery } from 'st-store';

@Injectable({ providedIn: 'root' })
export class CharacterQuery extends EntityQuery<Character> {
  constructor(private characterStore: CharacterStore) {
    super(characterStore);
  }
}
