import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Score, ScoreAddDto, ScoreTable } from '../../model/score';
import { HttpParams } from '../../util/http-params';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  constructor(private http: HttpClient) {}

  endPoint = 'score';

  add(dto: ScoreAddDto): Observable<Score> {
    return this.http.post<Score>(this.endPoint, dto);
  }

  getTableScorePlayer(
    idGame: number,
    idMode: number,
    idPlatform: number,
    idType: number,
    idPlayer: number
  ): Observable<ScoreTable[][]> {
    const params = new HttpParams({
      idGame,
      idMode,
      idPlatform,
      idType,
      idPlayer,
    });
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
}
