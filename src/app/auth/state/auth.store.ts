import { Injectable } from '@angular/core';
import { Auth } from '../../model/user';
import { Store } from '@stlmpp/store';

export function createInitialState(): Auth {
  return {
    user: null,
  };
}

@Injectable({ providedIn: 'root' })
export class AuthStore extends Store<Auth> {
  constructor() {
    super({
      name: 'auth',
      initialState: createInitialState(),
      persist: 'user.token',
    });
  }
}
