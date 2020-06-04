import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Score,
  ScoreAddDto,
  ScoreRandomDto,
  ScoreTable,
} from '../../model/score';
import { HttpParams } from '../../util/http-params';
import { ScoreStore } from './score.store';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  constructor(private http: HttpClient, private scoreStore: ScoreStore) {}

  endPoint = 'score';

  add(dto: ScoreAddDto): Observable<Score> {
    return this.http.post<Score>(this.endPoint, dto).pipe(
      tap(score => {
        this.scoreStore.add(score);
      })
    );
  }

  getTableScorePlayer(
    idGame: number,
    idMode: number,
    idPlatform: number,
    idType: number,
    idPlayer?: number
  ): Observable<ScoreTable[][]> {
    const params = new HttpParams(
      {
        idGame,
        idMode,
        idPlatform,
        idType,
        idPlayer,
      },
      true
    );
    return this.http.get<ScoreTable[][]>(`${this.endPoint}/table-player`, {
      params,
    });
  }

  getManyTopScore(
    idPlatform: number,
    idGame: number,
    idMode: number,
    idType: number,
    limit = 10,
    idCharacter?: number,
    idPlayer?: number
  ): Observable<ScoreTable[][]> {
    const params = new HttpParams({
      idPlatform,
      idGame,
      idMode,
      idType,
      limit,
      idCharacter,
      idPlayer,
    });
    return this.http.get<ScoreTable[][]>(`${this.endPoint}/table-top`, {
      params,
    });
  }

  findById(idScore: number): Observable<Score> {
    return this.http.get<Score>(`${this.endPoint}/${idScore}`).pipe(
      tap(score => {
        this.scoreStore.upsert(idScore, score);
      })
    );
  }

  findRandom(dto: ScoreRandomDto = {}): Observable<number> {
    const params = new HttpParams(dto, true);
    return this.http.get<number>(`${this.endPoint}/random`, { params });
  }
}
