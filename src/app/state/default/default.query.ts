import { Injectable } from '@angular/core';
import { DefaultStore } from './default.store';
import { Default } from '../../model/default';
import { map, pluck } from 'rxjs/operators';
import { Query } from '@stlmpp/store';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DefaultQuery extends Query<Default> {
  constructor(protected defaultStore: DefaultStore) {
    super(defaultStore);
  }

  idAvatar$: Observable<number> = this.select('avatar').pipe(pluck('id'));
  imageExtensions$ = this.select('imageExtensions');
  imageExtensionsAccept$ = this.imageExtensions$.pipe(
    map(images => images.map(o => 'image/' + o).join(', '))
  );
  loading$ = this.select('loading');
}
