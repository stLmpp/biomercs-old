import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultStore } from './default.store';
import { Observable } from 'rxjs';
import { Default } from '../../model/default';
import { tap } from 'rxjs/operators';
import { setLoading, useCache } from '@stlmpp/store';

@Injectable({ providedIn: 'root' })
export class DefaultService {
  constructor(private defaultStore: DefaultStore, private http: HttpClient) {}

  getDefault(): Observable<Default> {
    return this.http.get<Default>('defaults').pipe(
      setLoading(this.defaultStore),
      useCache(this.defaultStore),
      tap(defaults => {
        this.defaultStore.update(defaults);
      })
    );
  }
}
