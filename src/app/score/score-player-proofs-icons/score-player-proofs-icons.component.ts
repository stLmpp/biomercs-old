import { Component, OnInit, ChangeDetectionStrategy, Input, Inject } from '@angular/core';
import { ScorePlayerProof, trackByScorePlayerProof } from '../../model/score-player-proof';
import { MatDialog } from '@angular/material/dialog';
import { WINDOW } from '../../core/window.service';

@Component({
  selector: 'app-score-player-proofs-icons',
  templateUrl: './score-player-proofs-icons.component.html',
  styleUrls: ['./score-player-proofs-icons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScorePlayerProofsIconsComponent implements OnInit {
  constructor(public matDialog: MatDialog, @Inject(WINDOW) public window: Window) {}

  @Input() proofs: ScorePlayerProof[];

  trackByScorePlayerProof = trackByScorePlayerProof;

  openVideo(url: string): void {
    this.window.open(url, '_blank');
  }

  ngOnInit(): void {}
}
