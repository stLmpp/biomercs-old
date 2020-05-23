import { Injectable } from '@angular/core';
import { Stage } from '../../model/stage';
import { EntityStore } from 'st-store';

@Injectable({ providedIn: 'root' })
export class StageStore extends EntityStore<Stage> {
  constructor() {
    super({ name: 'stage', cache: 900_000 });
  }
}
