import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { DefaultStore } from './default.store';
import { Default } from '../../model/default';
import { map, pluck } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DefaultQuery extends Query<Default> {
  constructor(protected store: DefaultStore) {
    super(store);
  }

  idAvatar$ = this.select('avatar').pipe(pluck('id'));
  imageExtensions$ = this.select('imageExtensions');
  imageExtensionsAccept$ = this.imageExtensions$.pipe(
    map(images => images.map(o => 'image/' + o).join(', '))
  );
  loading$ = this.select('loading');
}
