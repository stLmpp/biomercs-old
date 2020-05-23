import { Injectable } from '@angular/core';
import { Type } from '../../model/type';
import { EntityStore } from 'st-store';

@Injectable({ providedIn: 'root' })
export class TypeStore extends EntityStore<Type> {
  constructor() {
    super({ name: 'type', cache: 900_000 });
  }
}
