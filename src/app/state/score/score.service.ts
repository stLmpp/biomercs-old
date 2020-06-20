import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Score,
  ScoreAddDto,
  ScoreApprovalParamsDto,
  ScoreAverageDto,
  ScoreIsWrDto,
  ScoreIsWrViewModel,
  ScoreRandomDto,
  ScoreTable,
} from '../../model/score';
import { HttpParams } from '../../util/http-params';
import { ScoreStore } from './score.store';
import { tap } from 'rxjs/operators';
import { ScorePlayerProofAddDto } from '../../model/score-player-proof';
import { refreshMap } from '../../util/operators/refresh';
import { ScorePlayerProofService } from '../score-player-proof/score-player-proof.service';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  constructor(
    private http: HttpClient,
    private scoreStore: ScoreStore,
    private scorePlayerProofService: ScorePlayerProofService
  ) {}

  endPoint = 'score';

  add(dto: ScoreAddDto): Observable<Score> {
    const proofs = dto.scorePlayers.reduce(
      (acc: ScorePlayerProofAddDto[], player) => [
        ...acc,
        ...player.scorePlayerProofs.map(o => ({ ...o, idPlayer: player.idPlayer })),
      ],
      []
    );
    return this.http.post<Score>(this.endPoint, dto).pipe(
      refreshMap(score => {
        const newProofs = proofs.map(proof => ({
          ...proof,
          idScorePlayer: score.scorePlayers.find(player => player.idPlayer === proof.idPlayer).id,
        }));
        return this.scorePlayerProofService.addManyWithFiles(newProofs);
      }),
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

  isWr(dto: ScoreIsWrDto): Observable<ScoreIsWrViewModel> {
    return this.http.post<ScoreIsWrViewModel>(`${this.endPoint}/is-wr`, dto);
  }

  findApprovalList(dto: ScoreApprovalParamsDto, user = false): Observable<Score[]> {
    const params = new HttpParams(dto, true);
    return this.http.get<Score[]>(`${this.endPoint}/approval-list${user ? '/user' : ''}`, { params });
  }

  findRequireApproval(dto: ScoreAverageDto): Observable<boolean> {
    const params = new HttpParams(dto, true);
    return this.http.get<boolean>(`${this.endPoint}/require-approval`, { params });
  }
}
