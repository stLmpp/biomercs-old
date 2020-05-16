import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultStore } from './default.store';
import { Observable } from 'rxjs';
import { Default } from '../../model/default';
import { tap } from 'rxjs/operators';
import { cacheable, setLoading } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class DefaultService {
  constructor(private defaultStore: DefaultStore, private http: HttpClient) {}

  getDefault(): Observable<Default> {
    const http$ = this.http.get<Default>('defaults').pipe(
      setLoading(this.defaultStore),
      tap(defaults => {
        this.defaultStore.update(defaults);
        this.defaultStore.setHasCache(true, { restartTTL: true });
      })
    );
    return cacheable(this.defaultStore, http$, { emitNext: true });
  }
}
