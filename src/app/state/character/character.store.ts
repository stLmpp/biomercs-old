import { Injectable } from '@angular/core';
import { Character } from '../../model/character';
import { EntityStore } from '@stlmpp/store';

@Injectable({ providedIn: 'root' })
export class CharacterStore extends EntityStore<Character> {
  constructor() {
    super({ name: 'character', cache: 900_000 });
  }
}
