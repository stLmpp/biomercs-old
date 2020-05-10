import { Observable, OperatorFunction } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const toBase64 = (): OperatorFunction<Blob, string> =>
  switchMap(blob => {
    return new Observable<string>(observer => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        observer.next(reader.result as string);
        observer.complete();
      };
      reader.onerror = err => {
        observer.error(err);
      };
    });
  });
