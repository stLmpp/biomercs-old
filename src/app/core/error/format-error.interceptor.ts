import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '../../model/http-error';

@Injectable({ providedIn: 'root' })
export class FormatErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(({ error }: HttpErrorResponse) => {
        if ((error as any).statusCode && !error.status) {
          error.status = (error as any).statusCode;
        }
        return throwError(error);
      })
    );
  }
}
