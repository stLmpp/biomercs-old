import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpError, HttpErrorResponse } from '../../model/http-error';

@Injectable({ providedIn: 'root' })
export class FormatErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(({ status, error }: HttpErrorResponse) => {
        const newErr: HttpError = { ...error, status };
        if (status === 500) {
          newErr.message = 'Internal error!';
        }
        return throwError(newErr);
      })
    );
  }
}
