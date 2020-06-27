import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { Control, FormControl, FormGroup } from '@ng-stack/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ScorePlayer } from '../../../model/score-player';
import { SiteQuery } from '../../../state/site/site.query';
import { trackBySite } from '../../../model/site';
import { DefaultQuery } from '../../../state/default/default.query';
import { ScorePlayerService } from '../../../state/score-player/score-player.service';
import { ScorePlayerProofService } from '../../../state/score-player-proof/score-player-proof.service';
import { forkJoin, Observable, of } from 'rxjs';
import { ScorePlayerProof } from '../../../model/score-player-proof';
import { removeNullObject } from '../../../util/util';
import { finalize, switchMap } from 'rxjs/operators';
import { siblingRequiredValidator } from '../../../validators/sibling-validator.directive';

interface ScoreApprovalFillForm {
  description: string;
  file?: Control<FileList>;
  idSite?: number;
  url?: string;
}

export interface ScoreApprovalFillData {
  scorePlayer: ScorePlayer;
  observable?: Observable<any>;
}

@Component({
  selector: 'app-score-approval-fill',
  templateUrl: './score-approval-fill.component.html',
  styleUrls: ['./score-approval-fill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreApprovalFillComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) { observable, scorePlayer }: ScoreApprovalFillData,
    public siteQuery: SiteQuery,
    public defaultQuery: DefaultQuery,
    public matDialogRef: MatDialogRef<ScoreApprovalFillComponent>,
    private scorePlayerService: ScorePlayerService,
    private scorePlayerProofService: ScorePlayerProofService
  ) {
    this.scorePlayer = scorePlayer;
    this.observable$ = observable ?? of(null);
  }

  scorePlayer: ScorePlayer;
  private observable$: Observable<any>;

  form: FormGroup<ScoreApprovalFillForm>;

  trackBySite = trackBySite;

  onSubmit(): void {
    const { description, url, file, idSite } = this.form.getDirtyValues();
    const scorePlayerProofFile = this.scorePlayer.scorePlayerProofs.find(spp => spp.idImage);
    const scorePlayerProofSite = this.scorePlayer.scorePlayerProofs.find(spp => spp.idSite || spp.url);
    this.form.disable();
    this.matDialogRef.disableClose = true;
    const updatePlayer$ = description
      ? this.scorePlayerService.update(this.scorePlayer.id, { description })
      : of(null);
    let updateFile$: Observable<ScorePlayerProof> = of(null);
    if (file) {
      if (scorePlayerProofFile) {
        updateFile$ = this.scorePlayerProofService.updateFile(scorePlayerProofFile.id, file[0]);
      } else {
        updateFile$ = this.scorePlayerProofService.uploadProof(this.scorePlayer.id, file[0]);
      }
    }
    let updateProof$: Observable<ScorePlayerProof> = of(null);
    if (idSite || url) {
      if (scorePlayerProofSite) {
        updateProof$ = this.scorePlayerProofService.update(
          scorePlayerProofSite.id,
          removeNullObject({ idSite, url })
        );
      } else {
        updateProof$ = this.scorePlayerProofService.add({ idSite, url, idScorePlayer: this.scorePlayer.id });
      }
    }
    forkJoin([updatePlayer$, updateFile$, updateProof$])
      .pipe(
        switchMap(() => this.observable$),
        finalize(() => {
          this.form.enable();
        })
      )
      .subscribe(() => {
        this.matDialogRef.close(true);
      });
  }

  ngOnInit(): void {
    const proofSite = this.scorePlayer.scorePlayerProofs.find(p => p.idSite);
    this.form = new FormGroup<ScoreApprovalFillForm>({
      description: new FormControl(this.scorePlayer.description),
      file: new FormControl(),
      idSite: new FormControl(proofSite?.idSite, [siblingRequiredValidator('url')]),
      url: new FormControl(proofSite?.url, [siblingRequiredValidator('idSite')]),
    });
  }
}
