import { isObservable, Observable, OperatorFunction, throwError } from 'rxjs';
import { HttpError, HttpErrorResponse } from '../../model/http-error';
import { catchError } from 'rxjs/operators';

export const catchHttpError = <T>(callback: (error: HttpError) => any): OperatorFunction<T, T> =>
  catchError((err: HttpErrorResponse) => {
    const ret = callback(err.error);
    if (isObservable(ret)) {
      return ret as Observable<any>;
    } else {
      return throwError(err);
    }
  });
