import { Observable, OperatorFunction } from 'rxjs';
import { HttpError } from '../../model/http-error';
import { catchError } from 'rxjs/operators';

export const catchHttpError = <T>(
  callback: (error: HttpError) => Observable<never>
): OperatorFunction<T, T> => catchError(callback);
