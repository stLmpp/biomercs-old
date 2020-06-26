import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScoreApproval, ScoreApprovalAddDto, ScoreApprovalAddManyDto } from '../../model/score-approval';

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

  addManyAdmin(dto: ScoreApprovalAddManyDto): Observable<ScoreApproval[]> {
    return this.http.post<ScoreApproval[]>(`${this.endPoint}/admin/batch`, dto);
  }

  addManyUser(dto: ScoreApprovalAddManyDto): Observable<ScoreApproval[]> {
    return this.http.post<ScoreApproval[]>(`${this.endPoint}/user/batch`, dto);
  }
}
