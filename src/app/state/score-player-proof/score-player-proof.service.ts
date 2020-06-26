import { Injectable } from '@angular/core';
import { SuperService } from '../../shared/super/super-service';
import {
  ScorePlayerProof,
  ScorePlayerProofAddDto,
  ScorePlayerProofUpdateDto,
} from '../../model/score-player-proof';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { flatten } from '@angular/compiler';

@Injectable({ providedIn: 'root' })
export class ScorePlayerProofService extends SuperService<
  ScorePlayerProof,
  ScorePlayerProofAddDto,
  ScorePlayerProofUpdateDto
> {
  constructor(private http: HttpClient) {
    super(http, { endPoint: 'score-player-proof', file: { idKey: 'idImage', key: 'image' } });
  }

  uploadProof(idScorePlayer: number, file: File): Observable<ScorePlayerProof> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    return this.http.post<ScorePlayerProof>(`${this.endPoint}/image/${idScorePlayer}`, formData, { headers });
  }

  addManyWithFiles(dto: ScorePlayerProofAddDto[]): Observable<ScorePlayerProof[]> {
    const files = dto.filter(d => !!d.file?.length);
    const urls = dto.filter(d => d.url);
    const files$: Observable<ScorePlayerProof[]> = files.length
      ? forkJoin(files.map(file => this.uploadProof(file.idScorePlayer, file.file[0])))
      : of([]);
    const urls$: Observable<ScorePlayerProof[]> = urls.length ? this.addMany(urls) : of([]);
    return forkJoin([files$, urls$]).pipe(map(flatten));
  }

  updateFile(idScorePlayerProof: number, file: File): Observable<ScorePlayerProof> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    return this.http.patch<ScorePlayerProof>(`${this.endPoint}/${idScorePlayerProof}/image`, formData, {
      headers,
    });
  }
}
