import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Auth } from '../../model/user';

export function createInitialState(): Auth {
  return {
    user: null,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'auth' })
export class AuthStore extends Store<Auth> {
  constructor() {
    super(createInitialState());
  }
}
