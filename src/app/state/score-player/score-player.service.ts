import { Injectable } from '@angular/core';
import { SuperService } from '../../shared/super/super-service';
import { ScorePlayer, ScorePlayerAddDto, ScorePlayerUpdateDto } from '../../model/score-player';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ScorePlayerService extends SuperService<ScorePlayer, ScorePlayerAddDto, ScorePlayerUpdateDto> {
  constructor(private http: HttpClient) {
    super(http, { endPoint: 'score-player' });
  }
}
