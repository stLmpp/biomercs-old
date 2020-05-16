import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { toBase64 } from './to-base64.operator';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  findById(id: number): Observable<string> {
    return this.http
      .get<Blob>(`${environment.uploadId}/${id}`, {
        // @ts-ignore
        responseType: 'blob',
      })
      .pipe(toBase64());
  }

  findByName(name: string): Observable<string> {
    return this.http
      .get<Blob>(`${environment.uploadName}/${name}`, {
        // @ts-ignore
        responseType: 'blob',
      })
      .pipe(toBase64());
  }
}
