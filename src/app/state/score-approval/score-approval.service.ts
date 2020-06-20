import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScoreApproval, ScoreApprovalAddDto } from '../../model/score-approval';

@Injectable({ providedIn: 'root' })
export class ScoreApprovalService {
  constructor(private http: HttpClient) {}

  endPoint = 'score-approval';

  addAdmin(dto: ScoreApprovalAddDto): Observable<ScoreApproval> {
    return this.http.post<ScoreApproval>(`${this.endPoint}/admin`, dto);
  }

  addUser(dto: ScoreApprovalAddDto): Observable<ScoreApproval> {
    return this.http.post<ScoreApproval>(`${this.endPoint}/user`, dto);
  }
}
