import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor() {}

  private _loading$ = new BehaviorSubject<number[]>([]);
  public isLoading$ = this._loading$.asObservable().pipe(
    map(loadings => !!loadings.length),
    debounceTime(250)
  );

  add(): void {
    this._loading$.next([...this._loading$.value, 1]);
  }

  remove(): void {
    const array = this._loading$.value;
    array.pop();
    this._loading$.next(array);
  }
}
