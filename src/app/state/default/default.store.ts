import { Injectable } from '@angular/core';
import { Default } from '../../model/default';
import { Store } from '@stlmpp/store';

export function createInitialState(): Default {
  return {
    avatar: null,
    loading: false,
    imageExtensions: [],
  };
}

@Injectable({ providedIn: 'root' })
export class DefaultStore extends Store<Default> {
  constructor() {
    super({
      name: 'default',
      initialState: createInitialState(),
      cache: 900_000,
    });
  }
}
