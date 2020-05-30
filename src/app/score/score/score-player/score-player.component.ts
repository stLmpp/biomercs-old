import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Inject,
} from '@angular/core';
import { ScorePlayer } from '../../../model/score-player';
import { trackByScorePlayerProof } from '../../../model/score-player-proof';
import { WINDOW } from '../../../core/window.service';

@Component({
  selector: 'app-score-player',
  templateUrl: './score-player.component.html',
  styleUrls: ['./score-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScorePlayerComponent implements OnInit {
  constructor(@Inject(WINDOW) public window: Window) {}

  @Input() player: ScorePlayer;
  @Input() playerNumber: number;

  trackByScorePlayerProof = trackByScorePlayerProof;

  openVideo(url: string): void {
    this.window.open(url, '_blank');
  }

  ngOnInit(): void {}
}
